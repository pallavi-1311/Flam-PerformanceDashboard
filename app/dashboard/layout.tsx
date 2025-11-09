'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDataStream } from '../../hooks/useDataStream';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import { aggregateData } from '../../lib/dataGenerator';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import ScatterPlot from '../../components/charts/ScatterPlot';
import Heatmap from '../../components/charts/Heatmap';
import FilterPanel from '../../components/controls/FilterPanel';
import PerformanceMonitor from '../../components/ui/PerformanceMonitor';
import DataTable from '../../components/ui/DataTable';

export default function DashboardPage() {
  const {
    data,
    isStreaming,
    toggleStreaming,
    increaseDataLoad,
    decreaseDataLoad,
    resetData
  } = useDataStream(10000);
  
  const {
    metrics,
    updateDataPointCount,
    recordRenderTime,
    updateFrame
  } = usePerformanceMonitor();
  
  const [aggregation, setAggregation] = useState('none');
  const [chartType, setChartType] = useState('line');
  
  const displayData = useMemo(() => {
    if (aggregation === 'none') return data;
    
    const periodMap: Record<string, number> = {
      '1min': 60000,
      '5min': 300000,
      '1hour': 3600000
    };
    
    const period = periodMap[aggregation];
    return period ? aggregateData(data, period) : data;
  }, [data, aggregation]);
  
  useEffect(() => {
    updateDataPointCount(displayData.length);
  }, [displayData.length, updateDataPointCount]);
  
  const handleRenderComplete = useCallback((time: number) => {
    recordRenderTime(time);
    updateFrame();
  }, [recordRenderTime, updateFrame]);
  
  const ChartComponent = useMemo(() => {
    const components: Record<string, any> = {
      line: LineChart,
      bar: BarChart,
      scatter: ScatterPlot,
      heatmap: Heatmap
    };
    return components[chartType] || LineChart;
  }, [chartType]);
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '20px',
      padding: '20px',
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      <aside style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
            <FilterPanel
      isStreaming={isStreaming}
      aggregation={aggregation}
      chartType={chartType}
      onToggleStreaming={toggleStreaming}
      onIncreaseLoad={increaseDataLoad}
      onDecreaseLoad={decreaseDataLoad}
      onReset={resetData}
      onAggregationChange={setAggregation}
      onChartTypeChange={setChartType}
      timeRange="1min"                      // ✅ temporary default value
      onTimeRangeChange={() => {}}          // ✅ empty callback
    />

        <PerformanceMonitor metrics={metrics} />
      </aside>
      
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          height: '500px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <ChartComponent data={displayData} onRenderComplete={handleRenderComplete} />
        </div>
        
        <DataTable data={displayData} />
      </main>
    </div>
  );
}