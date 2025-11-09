'use client';

import { useRef, useState, useEffect, memo } from 'react';
import type { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

interface LineChartProps {
  data: DataPoint[];
  onRenderComplete?: (time: number) => void;
}

function LineChart({ data, onRenderComplete }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Include your existing zoom/pan states from renderer
  const { setScale, setOffset, scale, offset } = useChartRenderer(
    canvasRef,
    data,
    onRenderComplete
  );

  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Tooltip state
  const [hoverPoint, setHoverPoint] = useState<DataPoint | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  // 🧠 Handle zoom/pan interactions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.5), 5));
    };

    const handleMouseDown = (e: MouseEvent) => {
      setDragging(true);
      setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        setLastPos({ x: e.clientX, y: e.clientY });
      } else {
        // Tooltip logic (only when not dragging)
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const step = width / data.length;
        const index = Math.round((x - offset.x) / (step * scale));
        const point = data[index];
        if (point) {
          setHoverPoint(point);
          setHoverCoords({ x, y: e.clientY - rect.top });
        } else {
          setHoverPoint(null);
          setHoverCoords(null);
        }
      }
    };

    const handleMouseUp = () => setDragging(false);
    const handleMouseLeave = () => {
      setHoverPoint(null);
      setHoverCoords(null);
    };

    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dragging, lastPos, setScale, setOffset, scale, offset, data]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Canvas for high-speed drawing */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      />

      {/* ✅ SVG overlay for axes and tooltip */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Axis lines */}
        <line x1="60" y1="10" x2="60" y2="90%" stroke="#ccc" strokeWidth="2" />
        <line x1="60" y1="90%" x2="95%" y2="90%" stroke="#ccc" strokeWidth="2" />

        {/* Tooltip */}
        {hoverPoint && hoverCoords && (
          <g transform={`translate(${hoverCoords.x}, ${hoverCoords.y - 20})`}>
            <rect
              x={-50}
              y={-25}
              width="100"
              height="35"
              rx="5"
              fill="rgba(0, 0, 0, 0.7)"
            />
            <text
              x="0"
              y="-5"
              textAnchor="middle"
              fill="#fff"
              fontSize="12"
              fontFamily="monospace"
            >
              {hoverPoint.value.toFixed(2)}
            </text>
          </g>
        )}
      </svg>

      {/* Small zoom info box */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: '#ffffffcc',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
        }}
      >
        🔍 Zoom: {scale.toFixed(2)} | Offset: ({offset.x.toFixed(0)}, {offset.y.toFixed(0)})
      </div>
    </div>
  );
}

export default memo(LineChart);
