'use client';

import { useEffect, useRef, RefObject, useState } from 'react';
import type { DataPoint } from '@/lib/types';
import {
  clearCanvas,
  drawGrid,
  calculateBounds,
  scalePoint,
  downsampleData,
} from '@/lib/canvasUtils';

const PADDING = { top: 20, right: 20, bottom: 40, left: 60 };

export function useChartRenderer(
  canvasRef: RefObject<HTMLCanvasElement>,
  data: DataPoint[],
  onRenderComplete?: (time: number) => void
) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number>();
  const initializedRef = useRef(false);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || initializedRef.current) return;

    initializedRef.current = true;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctxRef.current = ctx;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef]);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const start = performance.now();
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      clearCanvas(ctx, width, height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
      drawGrid(ctx, width, height, PADDING);

      const displayData = downsampleData(data, 2000);
      if (displayData.length > 0) {
        const bounds = calculateBounds(displayData);

        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;
        ctx.beginPath();

        displayData.forEach((point, i) => {
          const { x, y } = scalePoint(point, bounds, width, height, PADDING);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#333';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(bounds.maxY).toString(), PADDING.left - 10, PADDING.top + 10);
        ctx.fillText(Math.round(bounds.minY).toString(), PADDING.left - 10, height - PADDING.bottom - 5);
      }

      onRenderComplete?.(performance.now() - start);
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data, onRenderComplete, offset, scale]);

  return { setScale, setOffset, scale, offset };
}
