import React, { useState, useMemo, useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import dataset from '@/data/dataset.json';
import { aggregateDataByDimension } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useChartPerformance } from '@/lib/useChartPerformance';

const hierarchy = ['product', 'region', 'quarter', 'month'] as const;
type Level = typeof hierarchy[number];

type DrilldownPath = Array<{ level: Level, value: string }>;

const getNextLevel = (current: Level): Level | null => {
  const idx = hierarchy.indexOf(current);
  return idx < hierarchy.length - 1 ? hierarchy[idx + 1] : null;
};

const getPreviousLevel = (current: Level): Level | null => {
  const idx = hierarchy.indexOf(current);
  return idx > 0 ? hierarchy[idx - 1] : null;
};

const getFilteredData = (
  drilldownPath: DrilldownPath,
  currentLevel: Level
) => {
  let filteredData = [...dataset];
  drilldownPath.forEach(({ level, value }) => {
    if (level === 'product') {
      filteredData = filteredData.filter(item => item.product_name === value);
    } else if (level === 'region') {
      filteredData = filteredData.filter(item => item.region === value);
    } else if (level === 'quarter') {
      const quarterNumber = value.replace('Q', '');
      filteredData = filteredData.filter(item => item.quarter.toString() === quarterNumber);
    } else if (level === 'month') {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = monthNames.indexOf(value);
      if (monthIndex !== -1) {
        filteredData = filteredData.filter(item => item.month === monthIndex + 1);
      }
    }
  });
  return aggregateDataByDimension(filteredData, currentLevel);
};

const HighchartsDemo = () => {
  const [drilldownPath, setDrilldownPath] = useState<DrilldownPath>([]);
  const [currentLevel, setCurrentLevel] = useState<Level>('product');
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { start, end } = useChartPerformance('Highcharts', 10);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    start();
  }, [drilldownPath, currentLevel, start]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      end();
    }, 0);
    return () => clearTimeout(timeout);
  }, [drilldownPath, currentLevel, end]);

  const handleBreadcrumbClick = (index: number) => {
    const newPath = drilldownPath.slice(0, index);
    setDrilldownPath(newPath);
    if (index === 0) {
      setCurrentLevel('product');
    } else {
      const levelIndex = hierarchy.indexOf(newPath[newPath.length - 1].level);
      setCurrentLevel(hierarchy[levelIndex + 1]);
    }
  };

  const breadcrumbItems = [
    { level: 'product', value: 'All Products' },
    ...drilldownPath
  ];

  const options = useMemo(() => ({
    chart: {
      type: 'column',
      zooming: { type: 'x' },
      panKey: 'shift',
      resetZoomButton: {
        theme: {
          fill: 'white',
          stroke: 'silver',
          r: 0,
          states: {
            hover: {
              fill: '#41739D',
              style: { color: 'white' }
            }
          }
        }
      }
    },
    title: {
      text: `Revenue by ${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}`,
      style: { fontSize: '16px', fontWeight: 'bold' }
    },
    subtitle: {
      text: typeof document !== 'undefined' && document.ontouchstart === undefined ?
        'Click and drag in the plot area to zoom in' :
        'Pinch the chart to zoom in'
    },
    xAxis: {
      categories: getFilteredData(drilldownPath, currentLevel).map(item => item.name),
      title: { text: currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1) },
      labels: { rotation: -45, style: { fontSize: '10px' } },
      min: 0,
      max: getFilteredData(drilldownPath, currentLevel).length - 1,
      minRange: 1
    },
    yAxis: {
      title: { text: 'Revenue ($)' },
      labels: {
        formatter: function() {
          return '$' + ((this.value as number) / 1000).toFixed(0) + 'K';
        }
      }
    },
    legend: { enabled: false },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        borderWidth: 0,
        cursor: 'pointer',
        colorByPoint: true,
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
        states: { hover: { brightness: 0.1 } },
        allowPointSelect: false,
        point: {
          events: {
            click: function(this: Highcharts.Point) {
              const nextLevel = getNextLevel(currentLevel);
              if (!nextLevel) return;
              const clickedData = getFilteredData(drilldownPath, currentLevel).find(item => item.name === this.name);
              const clickedValue = clickedData ? clickedData.name : this.name;
              setDrilldownPath(prev => [...prev, { level: currentLevel, value: clickedValue }]);
              setCurrentLevel(nextLevel);
            }
          }
        }
      }
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Revenue: <b>${point.y:,.0f}</b>'
    },
    series: [{
      type: 'column',
      name: 'Revenue',
      data: getFilteredData(drilldownPath, currentLevel).map(item => ({ y: item.revenue, name: item.name }))
    }]
  }), [drilldownPath, currentLevel]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`text-sm ${index === breadcrumbItems.length - 1 ? 'font-semibold text-gray-900' : 'text-blue-600 hover:text-blue-800'}`}
              >
                {item.value}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {drilldownPath.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBreadcrumbClick(0)}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Reset
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div style={{ height: '400px', width: '100%', maxWidth: '800px' }}>
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={options}
          />
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-4">
        <strong>Highcharts Implementation:</strong> Click on bars to drill down through data hierarchy.
        Use breadcrumbs to navigate back. Path: Product → Region → Quarter → Month
      </div>
    </div>
  );
};

export default HighchartsDemo;
