'use client';

import { memo } from 'react';

interface FilterPanelProps {
  isStreaming: boolean;
  aggregation: string;
  chartType: string;
  onToggleStreaming: () => void;
  onIncreaseLoad: () => void;
  onDecreaseLoad: () => void;
  onReset: () => void;
  onAggregationChange: (value: string) => void;
  onChartTypeChange: (value: string) => void;
  // 🆕 add these:
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}


function FilterPanel({
  isStreaming,
  aggregation,
  chartType,
  onToggleStreaming,
  onIncreaseLoad,
  onDecreaseLoad,
  onReset,
  onAggregationChange,
  onChartTypeChange,
  timeRange,
  onTimeRangeChange
}: FilterPanelProps) {

  return (
    <div style={{
      padding: '20px',
      background: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px', 
        fontWeight: 600,
        color: '#1976D2',
        borderBottom: '2px solid #1976D2',
        paddingBottom: '10px'
      }}>
        Controls
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={onToggleStreaming}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: isStreaming ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 500,
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {isStreaming ? '⏸ Pause Streaming' : '▶ Start Streaming'}
        </button>
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '20px' 
      }}>
        <button
          onClick={onIncreaseLoad}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#1976D2';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#2196F3';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ➕ Add 5k Points
        </button>
        <button
          onClick={onDecreaseLoad}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#F57C00';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#FF9800';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ➖ Remove Half
        </button>
        <button
          onClick={onReset}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: '#F44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#D32F2F';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#F44336';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔄 Reset
        </button>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 600,
          color: '#333',
          marginBottom: '8px'
        }}>
          Aggregation:
        </label>
              {/* 🕐 Time Range Selector */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 600,
          color: '#333',
          marginBottom: '8px'
        }}>
          Time Range:
        </label>
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#2196F3'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
        >
          <option value="1m">Last 1 Minute</option>
          <option value="5m">Last 5 Minutes</option>
          <option value="1h">Last 1 Hour</option>
        </select>
      </div>

        <select
          value={aggregation}
          onChange={(e) => onAggregationChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#2196F3'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
        >
          <option value="none">None</option>
          <option value="1min">1 Minute</option>
          <option value="5min">5 Minutes</option>
          <option value="1hour">1 Hour</option>
        </select>
      </div>
      
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 600,
          color: '#333',
          marginBottom: '8px'
        }}>
          Chart Type:
        </label>
        <select
          value={chartType}
          onChange={(e) => onChartTypeChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '2px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#2196F3'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
        >
          <option value="line">📈 Line Chart</option>
          <option value="bar">📊 Bar Chart</option>
          <option value="scatter">🔵 Scatter Plot</option>
          <option value="heatmap">🟥 Heatmap</option>
        </select>
      </div>
    </div>
  );
}

export default memo(FilterPanel);