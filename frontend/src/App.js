import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import InputPanel from './components/InputPanel';
import RiskSummary from './components/RiskSummary';
import VariableRiskTable from './components/VariableRiskTable';
import RainfallChart from './components/RainfallChart';
import AdvisoryPanel from './components/AdvisoryPanel';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [inputs, setInputs] = useState({
    avg_temperature: 24.0,
    avg_humidity: 77.0,
    rainfall: 30.0,
    sunshine_duration: 5.0,
    harvested_area_ha: 2000.0,
    year: 2024,
    district: 'Ampelgading'
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const districts = [
    'Ampelgading', 'Bantur', 'Bululawang', 'Dampit', 'Dau', 'Donomulyo',
    'Gedangan', 'Gondanglegi', 'Jabung', 'Kalipare', 'Karangploso', 'Kasembon',
    'Kepanjen', 'Kromengan', 'Lawang', 'Ngajum', 'Ngantang', 'Pagak',
    'Pagelaran', 'Pakis', 'Pakisaji', 'Poncokusumo', 'Pujon', 'Singosari',
    'Sumbermanjing', 'Sumberpucung', 'Tajinan', 'Tirtoyudo', 'Tumpang',
    'Turen', 'Wagir', 'Wajak', 'Wonosari'
  ];

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/analyze`.replace(/\/+/g, '/').replace(':/', '://');
      const response = await axios.post(url, inputs, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setAnalysisResult(response.data);
    } catch (err) {
      let errorMessage = 'Failed to analyze climate risk';
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000';
      } else if (err.response?.status === 405) {
        errorMessage = `Method not allowed. The endpoint ${err.config?.url} may not support POST requests. Check your API URL: ${API_BASE_URL}`;
      } else if (err.response?.status === 404) {
        errorMessage = `Endpoint not found. Check your API URL: ${API_BASE_URL}/analyze`;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setAnalysisResult(null);
      console.error('Analysis error:', err);
      console.error('Request URL:', err.config?.url);
      console.error('Response status:', err.response?.status);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-analyze on mount
    analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Debounce auto-analysis when inputs change
    const timeoutId = setTimeout(() => {
      analyze();
    }, 500); // Wait 500ms after last input change

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const handleInputChange = (name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌾 Rice Climate Risk Intelligence Dashboard</h1>
        <p>Assess climate risk for rice cultivation</p>
      </header>

      <div className="container">
        <div className="main-content">
          <div className="left-panel">
            <InputPanel
              inputs={inputs}
              districts={districts}
              onInputChange={handleInputChange}
              onAnalyze={analyze}
              loading={loading}
            />
          </div>

          <div className="right-panel">
            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            {analysisResult && (
              <>
                <RiskSummary
                  overallRisk={analysisResult.overall_risk}
                  stabilityScore={analysisResult.stability_score}
                  explanations={analysisResult.explanations}
                  perVariableRisk={analysisResult.per_variable_risk}
                />

                <VariableRiskTable
                  perVariableRisk={analysisResult.per_variable_risk}
                  explanations={analysisResult.explanations}
                />

                <RainfallChart
                  currentRainfall={inputs.rainfall}
                  predictedYield={analysisResult.predicted_yield}
                />

                <AdvisoryPanel
                  perVariableRisk={analysisResult.per_variable_risk}
                  explanations={analysisResult.explanations}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

