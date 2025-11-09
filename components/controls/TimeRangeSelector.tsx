'use client';

import { memo } from 'react';

interface TimeRangeSelectorProps {
  onRangeChange: (range: string) => void;
}

function TimeRangeSelector({ onRangeChange }: TimeRangeSelectorProps) {
  return (
    <div style={{
      padding: '20px',
      background: '#f5f5f5',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 600 }}>
        Time Range
      </h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['1h', '6h', '24h', '7d', 'All'].map(range => (
          <button
            key={range}
            onClick={() => onRangeChange(range)}
            style={{
              padding: '6px 12px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(TimeRangeSelector);