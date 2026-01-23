import React from 'react';
import './AdvisoryPanel.css';

function AdvisoryPanel({ perVariableRisk, explanations }) {
  const generateAdvisories = () => {
    const advisories = [];

    Object.entries(perVariableRisk || {}).forEach(([variable, risk]) => {
      if (risk === 'HIGH_RISK') {
        if (variable === 'rainfall') {
          advisories.push({
            type: 'error',
            message: 'Excess rainfall may lead to yield instability. Consider drainage improvements and flood management strategies.'
          });
        } else if (variable === 'avg_temperature') {
          advisories.push({
            type: 'error',
            message: 'High temperature is causing stress to rice crops. Consider heat-resistant varieties or shade management.'
          });
        } else if (variable === 'sunshine_duration') {
          advisories.push({
            type: 'error',
            message: 'Insufficient or excessive sunshine duration may impact rice growth. Monitor crop health closely.'
          });
        }
      } else if (risk === 'WARNING') {
        if (variable === 'rainfall') {
          advisories.push({
            type: 'warning',
            message: 'Rainfall is approaching stress levels. Prepare for potential waterlogging or drainage needs.'
          });
        } else if (variable === 'avg_temperature') {
          advisories.push({
            type: 'warning',
            message: 'Temperature is approaching stress levels for rice. Monitor crop conditions and consider irrigation adjustments.'
          });
        } else if (variable === 'sunshine_duration') {
          advisories.push({
            type: 'warning',
            message: 'Sunshine duration is approaching suboptimal levels. Monitor crop development.'
          });
        }
      } else {
        if (variable === 'rainfall') {
          advisories.push({
            type: 'success',
            message: 'Rainfall levels are within a stable range for rice cultivation.'
          });
        } else if (variable === 'avg_temperature') {
          advisories.push({
            type: 'success',
            message: 'Temperature is within optimal range for rice growth.'
          });
        } else if (variable === 'sunshine_duration') {
          advisories.push({
            type: 'success',
            message: 'Sunshine duration is adequate for healthy rice development.'
          });
        } else if (variable === 'avg_humidity') {
          advisories.push({
            type: 'success',
            message: 'Humidity levels are stable and suitable for rice cultivation.'
          });
        }
      }
    });

    return advisories;
  };

  const advisories = generateAdvisories();

  const getAdvisoryIcon = (type) => {
    switch (type) {
      case 'error':
        return '🔴';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  const getAdvisoryClass = (type) => {
    return `advisory-item advisory-${type}`;
  };

  return (
    <div className="advisory-panel">
      <h2>💡 Advisory Recommendations</h2>
      <div className="advisories-list">
        {advisories.map((advisory, index) => (
          <div key={index} className={getAdvisoryClass(advisory.type)}>
            <span className="advisory-icon">{getAdvisoryIcon(advisory.type)}</span>
            <p className="advisory-message">{advisory.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdvisoryPanel;

