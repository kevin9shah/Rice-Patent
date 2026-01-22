# Rice Climate Risk Intelligence Dashboard

A decision-support web application for rice cultivation climate-risk analysis. This system uses a pre-trained machine learning model to assess climate risk and provide actionable insights for farmers, agricultural officers, and policymakers.

## Features

- **Risk Assessment**: Classifies climate conditions into SAFE, WARNING, or HIGH RISK zones
- **Stability Scoring**: Provides a 0.0-1.0 stability score for overall conditions
- **Variable-Level Analysis**: Detailed risk assessment for each climate variable (rainfall, temperature, humidity, sunshine)
- **Visualization**: Rainfall vs. yield chart showing instability thresholds
- **Advisory Recommendations**: Plain-English recommendations based on risk analysis

## Architecture

- **Backend**: FastAPI (Python) - Loads pre-trained model and performs risk analysis
- **Frontend**: React - Clean, minimal UI for decision support

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the project root directory:
```bash
cd /Users/kevinshah/Desktop/patent-f
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### POST /analyze

Analyzes climate risk for given environmental parameters.

**Request Body:**
```json
{
  "avg_temperature": 24.0,
  "avg_humidity": 77.0,
  "rainfall": 30.0,
  "sunshine_duration": 5.0,
  "harvested_area_ha": 2000.0,
  "year": 2024,
  "district": "Ampelgading"
}
```

**Response:**
```json
{
  "overall_risk": "SAFE",
  "stability_score": 0.75,
  "per_variable_risk": {
    "rainfall": "SAFE",
    "avg_temperature": "WARNING",
    "avg_humidity": "STABLE",
    "sunshine_duration": "SAFE"
  },
  "explanations": {
    "rainfall": "Rainfall is within stable range",
    "avg_temperature": "Temperature is approaching stress zone",
    "avg_humidity": "Humidity shows no instability detected",
    "sunshine_duration": "Sunshine duration is within stable range"
  },
  "predicted_yield": 1234.56
}
```

## Project Structure

```
patent-f/
├── backend/
│   └── main.py              # FastAPI backend
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   └── package.json
├── rf_base_model.pkl        # Pre-trained model (DO NOT MODIFY)
├── climate_thresholds.json  # Risk thresholds (DO NOT MODIFY)
├── district_encoding.json   # District mappings (DO NOT MODIFY)
├── Data_Cropyield_Prediction (1).csv  # Reference data
└── requirements.txt         # Python dependencies
```

## Important Notes

- **DO NOT** retrain or modify the pre-trained model
- **DO NOT** recompute or modify the climate thresholds
- **DO NOT** refit the district encoding
- The system is designed for decision support, not model research
- All risk logic is derived from `climate_thresholds.json`

## Usage

1. Open the dashboard in your browser
2. Adjust the input parameters using sliders and dropdowns
3. The analysis updates automatically as you change inputs
4. Review the risk summary, variable-level analysis, and advisory recommendations
5. Use the rainfall chart to visualize yield predictions across different rainfall levels

## Design Philosophy

- **Simple**: Clean, intuitive interface
- **Explainable**: Plain-English explanations, no ML jargon
- **Decision-focused**: Prioritizes actionable insights over technical metrics
- **User-friendly**: Designed for farmers, agricultural officers, and policymakers

# Rice-Patent
