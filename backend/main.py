from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import numpy as np
from pathlib import Path
import joblib
import warnings

app = FastAPI(title="Rice Climate Risk Intelligence API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts
BASE_DIR = Path(__file__).parent.parent

# Suppress version warnings for model loading
warnings.filterwarnings('ignore', category=UserWarning)

# Load model using joblib (standard for scikit-learn models)
try:
    model = joblib.load(BASE_DIR / "rf_base_model.pkl")
except Exception as e:
    # Fallback to pickle if joblib fails
    import pickle
    with open(BASE_DIR / "rf_base_model.pkl", "rb") as f:
        model = pickle.load(f)

with open(BASE_DIR / "climate_thresholds.json", "r") as f:
    climate_thresholds = json.load(f)

with open(BASE_DIR / "district_encoding.json", "r") as f:
    district_encoding = json.load(f)

# Input validation ranges (from CSV analysis)
INPUT_RANGES = {
    "avg_temperature": {"min": 20.0, "max": 30.0},
    "avg_humidity": {"min": 60.0, "max": 90.0},
    "rainfall": {"min": 0.0, "max": 100.0},
    "sunshine_duration": {"min": 0.0, "max": 10.0},
    "harvested_area_ha": {"min": 0.0, "max": 10000.0},
    "year": {"min": 2009, "max": 2025}
}


class AnalysisRequest(BaseModel):
    avg_temperature: float
    avg_humidity: float
    rainfall: float
    sunshine_duration: float
    harvested_area_ha: float
    year: int
    district: str


def classify_risk_zone(value: float, threshold: Optional[float], warning_start: Optional[float]) -> str:
    """Classify risk zone for a variable."""
    if threshold is None:
        return "STABLE"
    
    if value >= threshold:
        return "HIGH_RISK"
    elif warning_start and value >= warning_start:
        return "WARNING"
    else:
        return "SAFE"


def get_explanation(variable: str, value: float, risk: str, threshold: Optional[float], warning_start: Optional[float]) -> str:
    """Generate plain English explanation for variable risk."""
    variable_names = {
        "rainfall": "Rainfall",
        "avg_temperature": "Temperature",
        "sunshine_duration": "Sunshine duration",
        "avg_humidity": "Humidity"
    }
    
    var_name = variable_names.get(variable, variable)
    
    if risk == "HIGH_RISK" and threshold is not None:
        return f"{var_name} exceeds instability threshold ({threshold:.1f})"
    elif risk == "WARNING" and warning_start is not None:
        return f"{var_name} is approaching stress zone"
    elif risk == "SAFE":
        return f"{var_name} is within stable range"
    else:
        return f"{var_name} shows no instability detected"


def compute_stability_score(per_variable_risk: dict) -> float:
    """Compute overall stability score (0.0 = unstable, 1.0 = stable)."""
    risk_weights = {
        "HIGH_RISK": 0.0,
        "WARNING": 0.5,
        "SAFE": 1.0,
        "STABLE": 1.0
    }
    
    scores = [risk_weights.get(risk, 0.5) for risk in per_variable_risk.values()]
    return sum(scores) / len(scores) if scores else 0.5


def determine_overall_risk(per_variable_risk: dict) -> str:
    """Determine overall risk zone."""
    if any(risk == "HIGH_RISK" for risk in per_variable_risk.values()):
        return "HIGH_RISK"
    elif any(risk == "WARNING" for risk in per_variable_risk.values()):
        return "WARNING"
    else:
        return "SAFE"


@app.get("/")
def root():
    return {"message": "Rice Climate Risk Intelligence API"}


@app.post("/analyze")
def analyze(request: AnalysisRequest):
    """Analyze climate risk for given environmental parameters."""
    
    # Validate district
    if request.district not in district_encoding:
        raise HTTPException(
            status_code=400,
            detail=f"District '{request.district}' not found. Available districts: {list(district_encoding.keys())}"
        )
    
    # Encode district
    district_encoded = district_encoding[request.district]
    
    # Build input vector for model (order matters - must match training)
    # Assuming order: [district, year, harvested_area_ha, avg_temperature, avg_humidity, rainfall, sunshine_duration]
    input_vector = np.array([[
        district_encoded,
        request.year,
        request.harvested_area_ha,
        request.avg_temperature,
        request.avg_humidity,
        request.rainfall,
        request.sunshine_duration
    ]])
    
    # Run model inference
    try:
        predicted_yield = model.predict(input_vector)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {str(e)}")
    
    # Analyze risk for each variable
    per_variable_risk = {}
    explanations = {}
    
    # Rainfall
    rainfall_threshold = climate_thresholds["rainfall"]["instability_threshold"]
    rainfall_warning = climate_thresholds["rainfall"].get("warning_start")
    rainfall_risk = classify_risk_zone(request.rainfall, rainfall_threshold, rainfall_warning)
    per_variable_risk["rainfall"] = rainfall_risk
    explanations["rainfall"] = get_explanation("rainfall", request.rainfall, rainfall_risk, rainfall_threshold, rainfall_warning)
    
    # Temperature
    temp_threshold = climate_thresholds["avg_temperature"]["instability_threshold"]
    temp_warning = climate_thresholds["avg_temperature"].get("warning_start")
    temp_risk = classify_risk_zone(request.avg_temperature, temp_threshold, temp_warning)
    per_variable_risk["avg_temperature"] = temp_risk
    explanations["avg_temperature"] = get_explanation("avg_temperature", request.avg_temperature, temp_risk, temp_threshold, temp_warning)
    
    # Sunshine
    sunshine_threshold = climate_thresholds["sunshine_duration"]["instability_threshold"]
    sunshine_warning = climate_thresholds["sunshine_duration"].get("warning_start")
    sunshine_risk = classify_risk_zone(request.sunshine_duration, sunshine_threshold, sunshine_warning)
    per_variable_risk["sunshine_duration"] = sunshine_risk
    explanations["sunshine_duration"] = get_explanation("sunshine_duration", request.sunshine_duration, sunshine_risk, sunshine_threshold, sunshine_warning)
    
    # Humidity
    humidity_threshold = climate_thresholds["avg_humidity"]["instability_threshold"]
    humidity_warning = climate_thresholds["avg_humidity"].get("warning_start")
    humidity_risk = classify_risk_zone(request.avg_humidity, humidity_threshold, humidity_warning)
    per_variable_risk["avg_humidity"] = humidity_risk
    explanations["avg_humidity"] = get_explanation("avg_humidity", request.avg_humidity, humidity_risk, humidity_threshold, humidity_warning)
    
    # Compute overall metrics
    stability_score = compute_stability_score(per_variable_risk)
    overall_risk = determine_overall_risk(per_variable_risk)
    
    return {
        "overall_risk": overall_risk,
        "stability_score": round(stability_score, 2),
        "per_variable_risk": per_variable_risk,
        "explanations": explanations,
        "predicted_yield": float(predicted_yield)
    }

