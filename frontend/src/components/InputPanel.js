import React from 'react';
import './InputPanel.css';

function InputPanel({ inputs, districts, onInputChange, onAnalyze, loading }) {
  const handleSliderChange = (name, value) => {
    onInputChange(name, parseFloat(value));
  };

  const handleNumberChange = (name, value) => {
    const numValue = parseFloat(value) || 0;
    onInputChange(name, numValue);
  };

  const handleSelectChange = (name, value) => {
    onInputChange(name, value);
  };

  return (
    <div className="input-panel">
      <h2>📊 Input Parameters</h2>
      
      <div className="input-group">
        <label htmlFor="district">District</label>
        <select
          id="district"
          value={inputs.district}
          onChange={(e) => handleSelectChange('district', e.target.value)}
        >
          {districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="year">
          Year: <span className="value-display">{inputs.year}</span>
        </label>
        <input
          type="number"
          id="year"
          min="2009"
          max="2025"
          value={inputs.year}
          onChange={(e) => handleNumberChange('year', parseInt(e.target.value))}
        />
      </div>

      <div className="input-group">
        <label htmlFor="rainfall">
          Rainfall (mm): <span className="value-display">{inputs.rainfall.toFixed(1)}</span>
        </label>
        <input
          type="range"
          id="rainfall"
          min="0"
          max="100"
          step="0.1"
          value={inputs.rainfall}
          onChange={(e) => handleSliderChange('rainfall', e.target.value)}
        />
        <div className="range-labels">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="temperature">
          Temperature (°C): <span className="value-display">{inputs.avg_temperature.toFixed(1)}</span>
        </label>
        <input
          type="range"
          id="temperature"
          min="20"
          max="30"
          step="0.1"
          value={inputs.avg_temperature}
          onChange={(e) => handleSliderChange('avg_temperature', e.target.value)}
        />
        <div className="range-labels">
          <span>20</span>
          <span>30</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="humidity">
          Humidity (%): <span className="value-display">{inputs.avg_humidity.toFixed(1)}</span>
        </label>
        <input
          type="range"
          id="humidity"
          min="60"
          max="90"
          step="0.1"
          value={inputs.avg_humidity}
          onChange={(e) => handleSliderChange('avg_humidity', e.target.value)}
        />
        <div className="range-labels">
          <span>60</span>
          <span>90</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="sunshine">
          Sunshine Duration (hours): <span className="value-display">{inputs.sunshine_duration.toFixed(1)}</span>
        </label>
        <input
          type="range"
          id="sunshine"
          min="0"
          max="10"
          step="0.1"
          value={inputs.sunshine_duration}
          onChange={(e) => handleSliderChange('sunshine_duration', e.target.value)}
        />
        <div className="range-labels">
          <span>0</span>
          <span>10</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="area">
          Harvested Area (ha): <span className="value-display">{inputs.harvested_area_ha.toFixed(1)}</span>
        </label>
        <input
          type="range"
          id="area"
          min="0"
          max="10000"
          step="10"
          value={inputs.harvested_area_ha}
          onChange={(e) => handleSliderChange('harvested_area_ha', e.target.value)}
        />
        <div className="range-labels">
          <span>0</span>
          <span>10000</span>
        </div>
      </div>

      <button 
        className="analyze-button" 
        onClick={onAnalyze}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : '🔄 Update Analysis'}
      </button>
    </div>
  );
}

export default InputPanel;

