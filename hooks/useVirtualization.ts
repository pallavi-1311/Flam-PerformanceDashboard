'use client';

import { useState, useMemo, useCallback } from 'react';
import type { DataPoint } from '@/lib/types';

const ROW_HEIGHT = 35;
const VISIBLE_ROWS = 20;

export function useVirtualization(data: DataPoint[]) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const totalHeight = useMemo(() => data.length * ROW_HEIGHT, [data.length]);
  
  const startIndex = useMemo(() => 
    Math.floor(scrollTop / ROW_HEIGHT), 
    [scrollTop]
  );
  
  const endIndex = useMemo(() => 
    Math.min(startIndex + VISIBLE_ROWS, data.length),
    [startIndex, data.length]
  );
  
  const visibleItems = useMemo(() => 
    data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );
  
  const offsetY = useMemo(() => 
    startIndex * ROW_HEIGHT,
    [startIndex]
  );
  
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((event.target as HTMLDivElement).scrollTop);
  }, []);
  
  return {
    totalHeight,
    offsetY,
    visibleItems,
    handleScroll
  };
}