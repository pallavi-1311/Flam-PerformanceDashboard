'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { DataPoint, PerformanceMetrics } from '@/lib/types';
import { useDataStream } from '@/hooks/useDataStream';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface DataContextValue {
  data: DataPoint[];
  totalDataCount: number;
  isStreaming: boolean;
  toggleStreaming: () => void;
  increaseDataLoad: () => void;
  decreaseDataLoad: () => void;
  resetData: () => void;
  metrics: PerformanceMetrics;
  updateDataPointCount: (count: number) => void;
  recordRenderTime: (time: number) => void;
  updateFrame: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ 
  children, 
  initialData 
}: { 
  children: ReactNode;
  initialData?: DataPoint[];
}) {
  const dataStream = useDataStream(initialData?.length || 10000);
  const performanceMonitor = usePerformanceMonitor();
  
  return (
    <DataContext.Provider value={{ ...dataStream, ...performanceMonitor }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}