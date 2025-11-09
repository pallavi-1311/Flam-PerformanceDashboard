'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { DataPoint } from '@/lib/types';

export function useDataStream(initialCount: number = 10000, maxPoints: number = 50000) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const workerRef = useRef<Worker | null>(null);
  
  // Initialize Web Worker
  useEffect(() => {
    const worker = new Worker('/dataWorker.js');
    workerRef.current = worker;
    
    worker.onmessage = (e: MessageEvent) => {
      const { type, data: workerData, point, totalCount: workerTotal } = e.data;
      
      if (type === 'INITIAL_DATA') {
        setData(workerData);
        setTotalCount(workerTotal || workerData.length);
        console.log('✅ Worker INITIAL_DATA →', { visible: workerData.length, total: workerTotal });
      } else if (type === 'NEW_POINT') {
        setData((prev) => {
          const updated = prev.length >= maxPoints ? [...prev.slice(1), point] : [...prev, point];
          return updated;
        });
        setTotalCount(workerTotal || 0);
      }
    };
    
    // Generate initial data
    worker.postMessage({ type: 'GENERATE_INITIAL', payload: { count: initialCount } });
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      worker.terminate();
    };
  }, [initialCount, maxPoints]);
  
  // Start streaming
  const startStreaming = useCallback(() => {
    if (intervalRef.current || !workerRef.current) return;
    setIsStreaming(true);
    
    intervalRef.current = setInterval(() => {
      setData((currentData) => {
        if (currentData.length > 0) {
          const lastPoint = currentData[currentData.length - 1];
          workerRef.current?.postMessage({
            type: 'GENERATE_POINT',
            payload: { lastTimestamp: lastPoint.timestamp }
          });
        }
        return currentData;
      });
    }, 100);
  }, []);
  
  // Stop streaming
  const stopStreaming = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsStreaming(false);
    }
  }, []);
  
  // Toggle streaming
  const toggleStreaming = useCallback(() => {
    if (isStreaming) {
      stopStreaming();
    } else {
      startStreaming();
    }
  }, [isStreaming, startStreaming, stopStreaming]);
  
  // Increase data load
  const increaseDataLoad = useCallback(() => {
    setData((prev) => {
      if (prev.length === 0) {
        console.log('❌ No data to add to');
        return prev;
      }
      
      // Generate 5000 new points and append to existing data
      const lastPoint = prev[prev.length - 1];
      const newPoints: DataPoint[] = [];
      let timestamp = lastPoint.timestamp;
      
      for (let i = 0; i < 5000; i++) {
        timestamp += 100;
        newPoints.push({
          timestamp,
          value: Math.sin(timestamp / 10000) * 50 + Math.random() * 20 + 50,
          category: ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)]
        });
      }
      
      const updated = [...prev, ...newPoints].slice(-maxPoints);
      setTotalCount((prevTotal) => prevTotal + 5000);
      console.log('✅ Added 5k points. Before:', prev.length, 'After:', updated.length, 'Total tracked:', totalCount + 5000);
      return updated;
    });
  }, [maxPoints, totalCount]);
  
  // Decrease data load
  const decreaseDataLoad = useCallback(() => {
    setData((prev) => {
      const halfPoint = Math.floor(prev.length / 2);
      const newData = prev.slice(halfPoint);
      const removed = prev.length - newData.length;
      setTotalCount((prevTotal) => Math.max(newData.length, prevTotal - removed));
      console.log('✅ Removed half. Before:', prev.length, 'After:', newData.length, 'Removed:', removed);
      return newData;
    });
  }, []);
  
  // Reset data
  const resetData = useCallback(() => {
    stopStreaming();
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'GENERATE_INITIAL',
        payload: { count: initialCount }
      });
    }
  }, [stopStreaming, initialCount]);
  
  // Auto-start streaming after 1 second
  useEffect(() => {
    const timeout = setTimeout(() => {
      startStreaming();
    }, 1000);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [startStreaming]);
  
  return {
    data,
    totalDataCount: totalCount,
    isStreaming,
    toggleStreaming,
    increaseDataLoad,
    decreaseDataLoad,
    resetData
  };
}