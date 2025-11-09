'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { PerformanceMetrics } from '@/lib/types';
import { PerformanceMonitor } from '@/lib/performanceUtils';

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    dataProcessingTime: 0,
    dataPointCount: 0
  });
  
  const monitorRef = useRef<PerformanceMonitor>();
  const dataPointCountRef = useRef(0);
  
  useEffect(() => {
    monitorRef.current = new PerformanceMonitor();
    
    const intervalId = setInterval(() => {
      if (monitorRef.current) {
        setMetrics(monitorRef.current.getMetrics(dataPointCountRef.current));
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const updateDataPointCount = useCallback((count: number) => {
    dataPointCountRef.current = count;
  }, []);
  
  const recordRenderTime = useCallback((time: number) => {
    monitorRef.current?.recordRenderTime(time);
  }, []);
  
  const updateFrame = useCallback(() => {
    monitorRef.current?.updateFrame();
  }, []);
  
  return {
    metrics,
    updateDataPointCount,
    recordRenderTime,
    updateFrame
  };
}