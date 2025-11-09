import type { PerformanceMetrics } from './types';

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private renderTimes: number[] = [];
  
  updateFrame(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;
    
    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }
  
  recordRenderTime(time: number): void {
    this.renderTimes.push(time);
    if (this.renderTimes.length > 60) {
      this.renderTimes.shift();
    }
  }
  
  getMetrics(dataPointCount: number): PerformanceMetrics {
    const avgRenderTime = this.renderTimes.length > 0
      ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
      : 0;
    
    const memoryUsage = (performance as any).memory
      ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
      : 0;
    
    return {
      fps: Math.min(this.fps, 60), // Cap at 60 FPS
      memoryUsage,
      renderTime: Math.round(avgRenderTime * 100) / 100,
      dataProcessingTime: 0,
      dataPointCount
    };
  }
}