import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './RainfallChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function RainfallChart({ currentRainfall, predictedYield }) {
  // Generate rainfall values for the chart (0 to 100mm)
  const rainfallValues = useMemo(() => {
    return Array.from({ length: 101 }, (_, i) => i);
  }, []);

  // For demonstration, we'll create a simple yield curve
  // In a real implementation, you might want to call the API multiple times
  // or have a separate endpoint for generating the curve
  const yieldValues = useMemo(() => {
    // Simplified: create a curve that shows yield decreasing at high rainfall
    // This is a placeholder - in production, you'd want to use actual model predictions
    return rainfallValues.map(rainfall => {
      // Simple approximation: yield decreases after ~47mm (instability threshold)
      if (rainfall > 47) {
        return predictedYield * (1 - (rainfall - 47) * 0.02);
      }
      return predictedYield * (1 + (47 - rainfall) * 0.01);
    });
  }, [rainfallValues, predictedYield]);

  const instabilityThreshold = 46.94; // From climate_thresholds.json

  const data = {
    labels: rainfallValues,
    datasets: [
      {
        label: 'Predicted Yield',
        data: yieldValues,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Instability Threshold',
        data: Array(101).fill(null).map((_, i) => {
          if (i === Math.round(instabilityThreshold)) {
            return Math.max(...yieldValues);
          }
          return null;
        }),
        borderColor: 'rgb(220, 53, 69)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 6,
        pointBackgroundColor: 'rgb(220, 53, 69)',
        fill: false,
      },
      {
        label: 'Current Rainfall',
        data: Array(101).fill(null).map((_, i) => {
          if (i === Math.round(currentRainfall)) {
            return yieldValues[Math.round(currentRainfall)];
          }
          return null;
        }),
        borderColor: 'rgb(255, 152, 0)',
        borderWidth: 3,
        pointRadius: 8,
        pointBackgroundColor: 'rgb(255, 152, 0)',
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rainfall vs Predicted Rice Yield',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.datasetIndex === 0) {
              return `Yield: ${context.parsed.y.toFixed(2)}`;
            } else if (context.datasetIndex === 1) {
              return `Instability Threshold: ${instabilityThreshold.toFixed(1)}mm`;
            } else {
              return `Current: ${currentRainfall.toFixed(1)}mm`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Rainfall (mm)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Predicted Yield',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  return (
    <div className="rainfall-chart">
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default RainfallChart;

