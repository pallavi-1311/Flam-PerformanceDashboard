'use server';

import { generateInitialDataset } from '@/lib/dataGenerator';
import type { DataPoint } from '@/lib/types';

// 🧠 Simulates adding new data points (server-side)
export async function addDataPoints(currentData: DataPoint[], count: number = 5000) {
  const last = currentData[currentData.length - 1];
  const newPoints = generateInitialDataset(count).map((p, i) => ({
    ...p,
    timestamp: last.timestamp + (i + 1) * 100,
  }));
  return [...currentData, ...newPoints];
}

// 🧹 Halve the dataset
export async function halveDataPoints(currentData: DataPoint[]) {
  return currentData.slice(Math.floor(currentData.length / 2));
}

// 🔄 Reset data
export async function resetDataPoints(count: number = 10000) {
  return generateInitialDataset(count);
}
