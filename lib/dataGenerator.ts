import type { DataPoint } from './types';

const CATEGORIES = ['A', 'B', 'C', 'D', 'E'];

export function generateInitialDataset(count: number = 10000): DataPoint[] {
  const data: DataPoint[] = [];
  const now = Date.now();
  const interval = 100; // 100 ms between each point → ~16.6 minutes total

  for (let i = 0; i < count; i++) {
    // oldest point starts 10,000 * 100 ms (~1000 s) in the past
    const timestamp = now - (count - i) * interval;

    data.push({
      timestamp,
      value: Math.sin(i / 100) * 50 + Math.random() * 20 + 50,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
    });
  }

  return data;
}


export function generateDataPoint(lastTimestamp: number): DataPoint {
  return {
    timestamp: lastTimestamp + 100,
    value: Math.sin(lastTimestamp / 10000) * 50 + Math.random() * 20 + 50,
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
  };
}

export function aggregateData(
  data: DataPoint[],
  periodMs: number
): DataPoint[] {
  const buckets = new Map<number, { sum: number; count: number; category: string }>();
  
  data.forEach(point => {
    const bucket = Math.floor(point.timestamp / periodMs) * periodMs;
    const existing = buckets.get(bucket);
    
    if (existing) {
      existing.sum += point.value;
      existing.count++;
    } else {
      buckets.set(bucket, { sum: point.value, count: 1, category: point.category });
    }
  });
  
  return Array.from(buckets.entries()).map(([timestamp, { sum, count, category }]) => ({
    timestamp,
    value: sum / count,
    category
  }));
}