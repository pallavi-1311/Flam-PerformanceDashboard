'use client';

import { memo, useEffect, useRef, useState } from 'react';
import type { PerformanceMetrics } from '@/lib/types';

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics & {
    visiblePoints?: number;
  };
}

function PerformanceMonitor({ metrics }: PerformanceMonitorProps) {
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#4CAF50';
    if (fps >= 30) return '#FF9800';
    return '#F44336';
  };

  // 🧠 Average FPS (10s) + Sparkline data
  const [avgFps, setAvgFps] = useState(metrics.fps);
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);

  useEffect(() => {
    setFpsHistory((prev) => {
      const updated = [...prev, metrics.fps];
      return updated.length > 60 ? updated.slice(-60) : updated;
    });

    const avg =
      fpsHistory.length > 0
        ? fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length
        : metrics.fps;

    setAvgFps(Number(avg.toFixed(1)));
  }, [metrics.fps]);

  // 🧩 Visible / Total
  const visible = metrics.visiblePoints || metrics.dataPointCount || 0;
  const total = metrics.totalPoints || visible;   // 🆕 use totalPoints if present

  const visibleRatio = total > 0 ? Math.min(visible / total, 1) : 0;

  return (
    <div
      style={{
        padding: '20px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 600 }}>
        Performance Metrics
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
        }}
      >
        {/* FPS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
            FPS:
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: getFPSColor(metrics.fps),
            }}
          >
            {metrics.fps}
          </span>

          {/* 🧩 Sparkline */}
          <svg width="80" height="20" style={{ marginTop: '4px' }}>
            <polyline
              fill="none"
              stroke={getFPSColor(avgFps)}
              strokeWidth="2"
              points={fpsHistory
                .map(
                  (v, i) =>
                    `${(i / fpsHistory.length) * 80},${20 - (v / 60) * 20}`
                )
                .join(' ')}
            />
          </svg>
        </div>

        {/* Average FPS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
            Avg FPS (10s):
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: getFPSColor(avgFps),
            }}
          >
            {avgFps}
          </span>
        </div>

        {/* Render Time */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
            Render:
          </span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#333' }}>
            {metrics.renderTime.toFixed(2)} ms
          </span>
        </div>

        {/* Memory */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
            Memory:
          </span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#333' }}>
            {metrics.memoryUsage} MB
          </span>
        </div>
      </div>

      {/* 🧮 Visible Points / Total Points */}
      <div
        style={{
          marginTop: '15px',
          padding: '10px',
          background: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
            Visible / Total Points:
          </span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#333' }}>
            {visible.toLocaleString()} / {total.toLocaleString()}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '8px',
            width: '100%',
            background: '#ddd',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${visibleRatio * 100}%`,
              background:
                visibleRatio > 0.8
                  ? '#4CAF50'
                  : visibleRatio > 0.4
                  ? '#FF9800'
                  : '#F44336',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(PerformanceMonitor);
