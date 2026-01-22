import React from 'react';
import './RiskSummary.css';

function RiskSummary({ overallRisk, stabilityScore, explanations, perVariableRisk }) {
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH_RISK':
        return '#dc3545';
      case 'WARNING':
        return '#ff9800';
      case 'SAFE':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case 'HIGH_RISK':
        return 'HIGH RISK';
      case 'WARNING':
        return 'WARNING';
      case 'SAFE':
        return 'SAFE';
      default:
        return risk;
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'HIGH_RISK':
        return '🔴';
      case 'WARNING':
        return '⚠️';
      case 'SAFE':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  // Find the primary reason (highest risk variable)
  const getPrimaryReason = () => {
    const riskOrder = { 'HIGH_RISK': 3, 'WARNING': 2, 'SAFE': 1, 'STABLE': 1 };
    let highestRisk = 'SAFE';
    let reason = 'All variables within stable range';
    
    // Find the variable with highest risk
    Object.entries(perVariableRisk || {}).forEach(([varName, risk]) => {
      if (riskOrder[risk] > riskOrder[highestRisk]) {
        highestRisk = risk;
        reason = explanations[varName] || 'Risk detected';
      }
    });
    
    return reason;
  };

  return (
    <div className="risk-summary" style={{ borderColor: getRiskColor(overallRisk) }}>
      <div className="risk-header">
        <span className="risk-icon">{getRiskIcon(overallRisk)}</span>
        <h2 className="risk-title" style={{ color: getRiskColor(overallRisk) }}>
          {getRiskLabel(overallRisk)}
        </h2>
      </div>
      
      <div className="stability-score">
        <span className="score-label">Stability Score:</span>
        <span className="score-value" style={{ color: getRiskColor(overallRisk) }}>
          {stabilityScore.toFixed(2)}
        </span>
        <div className="score-bar">
          <div 
            className="score-fill" 
            style={{ 
              width: `${stabilityScore * 100}%`,
              backgroundColor: getRiskColor(overallRisk)
            }}
          />
        </div>
      </div>

      <div className="risk-reason">
        <strong>Reason:</strong> {getPrimaryReason()}
      </div>
    </div>
  );
}

export default RiskSummary;

