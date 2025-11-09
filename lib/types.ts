export interface DataPoint {
  timestamp: number;
  value: number;
  category: string;
  metadata?: Record<string, any>;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'scatter' | 'heatmap';
  dataKey: string;
  color: string;
  visible: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  dataProcessingTime: number;
  dataPointCount: number;
  totalPoints?: number;
  visiblePoints?: number;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface ChartBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export type AggregationPeriod = '1min' | '5min' | '1hour';