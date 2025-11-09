import type { DataPoint, ChartBounds } from './types';

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): void {
  const gridX = 10;
  const gridY = 8;
  
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  
  for (let i = 0; i <= gridX; i++) {
    const x = padding.left + (i * (width - padding.left - padding.right)) / gridX;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, height - padding.bottom);
    ctx.stroke();
  }
  
  for (let i = 0; i <= gridY; i++) {
    const y = padding.top + (i * (height - padding.top - padding.bottom)) / gridY;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }
}

export function calculateBounds(data: DataPoint[]): ChartBounds {
  if (data.length === 0) {
    return { minX: 0, maxX: 1, minY: 0, maxY: 100 };
  }
  
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  for (const point of data) {
    if (point.timestamp < minX) minX = point.timestamp;
    if (point.timestamp > maxX) maxX = point.timestamp;
    if (point.value < minY) minY = point.value;
    if (point.value > maxY) maxY = point.value;
  }
  
  const yPadding = (maxY - minY) * 0.1;
  minY -= yPadding;
  maxY += yPadding;
  
  return { minX, maxX, minY, maxY };
}

export function scalePoint(
  point: DataPoint,
  bounds: ChartBounds,
  width: number,
  height: number,
  padding: { top: number; right: number; bottom: number; left: number }
): { x: number; y: number } {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const x = padding.left + ((point.timestamp - bounds.minX) / (bounds.maxX - bounds.minX)) * chartWidth;
  const y = height - padding.bottom - ((point.value - bounds.minY) / (bounds.maxY - bounds.minY)) * chartHeight;
  
  return { x, y };
}

export function downsampleData(data: DataPoint[], maxPoints: number): DataPoint[] {
  if (data.length <= maxPoints) return data;
  
  const step = Math.ceil(data.length / maxPoints);
  const result: DataPoint[] = [];
  
  for (let i = 0; i < data.length; i += step) {
    result.push(data[i]);
  }
  
  return result;
}