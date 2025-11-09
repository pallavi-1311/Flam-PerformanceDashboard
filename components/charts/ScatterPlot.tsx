'use client';

import { useRef, useEffect, useState, memo } from 'react';
import type { DataPoint } from '@/lib/types';
import { clearCanvas, calculateBounds, scalePoint, downsampleData } from '@/lib/canvasUtils';

const PADDING = { top: 20, right: 20, bottom: 40, left: 60 };

function ScatterPlot({
  data,
  onRenderComplete,
}: {
  data: DataPoint[];
  onRenderComplete?: (t: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // 🧭 Zoom & Pan
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // 🎯 Tooltip
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

    const render = () => {
      const startTime = performance.now();
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      clearCanvas(ctx, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const displayData = downsampleData(data, 1000);
      if (displayData.length === 0) return;
      const bounds = calculateBounds(displayData);

      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      ctx.fillStyle = '#FF5722';
      displayData.forEach((point) => {
        const { x, y } = scalePoint(point, bounds, width, height, PADDING);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      const renderTime = performance.now() - startTime;
      onRenderComplete?.(renderTime);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => animationFrameRef.current && cancelAnimationFrame(animationFrameRef.current);
  }, [data, scale, offset]);

  // 🖱 Zoom + Pan + Tooltip
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
        // Tooltip hover detection
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;
        const displayData = downsampleData(data, 1000);
        const bounds = calculateBounds(displayData);

        // Find nearest point
        let nearest = null;
        let minDist = 9999;
        for (const point of displayData) {
          const { x: px, y: py } = scalePoint(point, bounds, width, height, PADDING);
          const dist = Math.hypot(px - (x - offset.x), py - (y - offset.y));
          if (dist < minDist && dist < 10) {
            minDist = dist;
            nearest = point;
          }
        }

        if (nearest) {
          setHoverPoint(nearest);
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
      {/* 🎨 Canvas Layer */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      />

      {/* 🧩 SVG Overlay for axes + tooltip */}
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

      {/* Zoom Info Box */}
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

export default memo(ScatterPlot);
