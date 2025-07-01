import { useRef } from 'react';

/**
 * useChartPerformance - React hook for measuring chart load performance.
 * @param label - Label for the chart (e.g., 'ECharts', 'D3', etc.)
 * @param sampleSize - Number of loads to average over (default: 10)
 */
export function useChartPerformance(label: string, sampleSize: number = 10) {
  const startTimeRef = useRef<number>(0);
  const loadTimesRef = useRef<number[]>([]);

  // Call this when chart loading starts
  const start = () => {
    startTimeRef.current = performance.now();
  };

  // Call this when chart is ready
  const end = () => {
    const endTime = performance.now();
    const loadTime = endTime - startTimeRef.current;
    loadTimesRef.current.push(loadTime);

    if (loadTimesRef.current.length === sampleSize) {
      const times = loadTimesRef.current;
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);
      console.log(`[%s] %d loads: avg=%sms, min=%sms, max=%sms`, label, sampleSize, avg.toFixed(2), min.toFixed(2), max.toFixed(2));
      loadTimesRef.current = [];
    } else {
      console.log(`[%s] Chart loaded in %sms`, label, loadTime.toFixed(2));
    }
  };

  return { start, end };
} 