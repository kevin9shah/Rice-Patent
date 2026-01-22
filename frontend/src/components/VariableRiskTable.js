import React from 'react';
import './VariableRiskTable.css';

function VariableRiskTable({ perVariableRisk, explanations }) {
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH_RISK':
        return '#dc3545';
      case 'WARNING':
        return '#ff9800';
      case 'SAFE':
      case 'STABLE':
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
      case 'STABLE':
        return 'SAFE';
      default:
        return risk;
    }
  };

  const variableLabels = {
    rainfall: 'Rainfall',
    avg_temperature: 'Temperature',
    avg_humidity: 'Humidity',
    sunshine_duration: 'Sunshine'
  };

  const variables = Object.keys(perVariableRisk || {});

  return (
    <div className="variable-risk-table">
      <h2>📋 Variable-Level Risk Analysis</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Status</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {variables.map(variable => {
            const risk = perVariableRisk[variable];
            return (
              <tr key={variable}>
                <td className="variable-name">
                  {variableLabels[variable] || variable}
                </td>
                <td>
                  <span 
                    className="risk-badge"
                    style={{ backgroundColor: getRiskColor(risk) }}
                  >
                    {getRiskLabel(risk)}
                  </span>
                </td>
                <td className="reason-text">
                  {explanations[variable] || 'No explanation available'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VariableRiskTable;

