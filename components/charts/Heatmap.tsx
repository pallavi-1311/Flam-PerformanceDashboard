'use client';

import { useRef, useEffect, useState, memo } from 'react';
import type { DataPoint } from '@/lib/types';
import { clearCanvas } from '@/lib/canvasUtils';

function Heatmap({
  data,
  onRenderComplete,
}: {
  data: DataPoint[];
  onRenderComplete?: (t: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // 🧭 Zoom & Pan states
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // 🧠 Tooltip
  const [hoverPoint, setHoverPoint] = useState<DataPoint | null>(null);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const getColor = (value: number, min: number, max: number): string => {
      const normalized = (value - min) / (max - min);
      const hue = (1 - normalized) * 240;
      return `hsl(${hue}, 70%, 50%)`;
    };

    const render = () => {
      const startTime = performance.now();
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      clearCanvas(ctx, width, height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);

      const gridSize = 20;
      const cellWidth = (width / gridSize) * scale;
      const cellHeight = (height / gridSize) * scale;

      const displayData = data.slice(-gridSize * gridSize);
      const values = displayData.map((d) => d.value);
      const min = Math.min(...values);
      const max = Math.max(...values);

      ctx.save();
      ctx.translate(offset.x, offset.y);

      displayData.forEach((point, index) => {
        const x = (index % gridSize) * cellWidth;
        const y = Math.floor(index / gridSize) * cellHeight;

        ctx.fillStyle = getColor(point.value, min, max);
        ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1);
      });

      ctx.restore();

      const renderTime = performance.now() - startTime;
      onRenderComplete?.(renderTime);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
  }, [data, scale, offset]);

  // 🖱 Zoom + Pan + Tooltip interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoom = e.deltaY < 0 ? 1.1 : 0.9;
      setScale((prev) => Math.min(Math.max(prev * zoom, 0.5), 5));
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
        // Tooltip when hovering
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridSize = 20;
        const indexX = Math.floor((x - offset.x) / ((rect.width / gridSize) * scale));
        const indexY = Math.floor((y - offset.y) / ((rect.height / gridSize) * scale));
        const index = indexY * gridSize + indexX;
        const point = data[index];

        if (point) {
          setHoverPoint(point);
          setHoverCoords({ x, y });
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
  }, [dragging, lastPos, offset, scale, data]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 🎨 Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      />

      {/* 🧩 SVG Overlay (axes + tooltip) */}
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
        {/* Axes */}
        <line x1="60" y1="10" x2="60" y2="90%" stroke="#ccc" strokeWidth="2" />
        <line x1="60" y1="90%" x2="95%" y2="90%" stroke="#ccc" strokeWidth="2" />

        {/* Tooltip */}
        {hoverPoint && hoverCoords && (
          <g transform={`translate(${hoverCoords.x}, ${hoverCoords.y - 20})`}>
            <rect x={-50} y={-25} width="100" height="35" rx="5" fill="rgba(0,0,0,0.7)" />
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

      {/* 🔍 Zoom Info */}
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

export default memo(Heatmap);
