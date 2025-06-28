import React, { useState, useEffect, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import dataset from '@/data/dataset.json';
import { aggregateDataByDimension } from '@/data/sampleData';

const EChartsDemo = () => {
  const [drilldownPath, setDrilldownPath] = useState<Array<{level: string, value: string}>>([]);
  const [currentLevel, setCurrentLevel] = useState<'product' | 'region' | 'quarter' | 'month' >('product');

  const getNextLevel = (current: string): 'product' | 'region' | 'quarter' | 'month' | null => {
    const hierarchy = ['product', 'region', 'quarter', 'month'];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex < hierarchy.length - 1 ? hierarchy[currentIndex + 1] as any : null;
  };

  const getPreviousLevel = (current: string): 'product' | 'region' | 'quarter' | 'month' | null => {
    const hierarchy = ['product', 'region', 'quarter', 'month'];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex > 0 ? hierarchy[currentIndex - 1] as any : null;
  };

  const getFilteredData = () => {
    let filteredData = [...dataset];
    
    drilldownPath.forEach(({ level, value }) => {
      if (level === 'product') {
        filteredData = filteredData.filter(item => item.product_name === value);
      } else if (level === 'region') {
        filteredData = filteredData.filter(item => item.region === value);
      } else if (level === 'quarter') {
        filteredData = filteredData.filter(item => item.quarter.toString() === value);
      }  else if (level === 'month') {
        filteredData = filteredData.filter(item => item.month.toString() === value);
      }
    });
    
    return aggregateDataByDimension(filteredData, currentLevel);
  };

  const chartData = useMemo(() => {
    const data = getFilteredData();
    return data.map(item => ({
      name:
      currentLevel === 'month'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(item.name) - 1]
       :item.name,
      value: item.revenue,
      originalName: item.name
    }));
  }, [currentLevel, drilldownPath]);

  const chartOption = useMemo(() => {
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    const pathString = drilldownPath.length > 0 ? ` > ${drilldownPath.map(p => p.value).join(' > ')}` : '';
    
    return {
      title: {
        text: `Revenue by ${levelName}${pathString}`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const data = params[0];
          return `${data.name}<br/>Revenue: $${data.value.toLocaleString()}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.map(item => item.name),
        axisLabel: {
          rotate: -45,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        name: 'Revenue ($)',
        axisLabel: {
          formatter: function(value: number) {
            return `$${(value / 1000).toFixed(0)}K`;
          }
        }
      },
      series: [
        {
          name: 'Revenue',
          type: 'bar',
          data: chartData.map(item => item.value),
          itemStyle: {
            color: function(params: any) {
              const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
              return colors[params.dataIndex % colors.length];
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }, [chartData, currentLevel, drilldownPath]);

  const handleChartClick = (params: any) => {
    const nextLevel = getNextLevel(currentLevel);
    if (!nextLevel) return;
    const clickedBar = chartData.find(item => item.name === params.name);
    const clickedValue = clickedBar ? clickedBar.originalName : params.name;
    
    setDrilldownPath([...drilldownPath, { level: currentLevel, value: clickedValue }]);
    setCurrentLevel(nextLevel);
  };

  const handleDrillUp = () => {
    if (drilldownPath.length === 0) return;
    
    const newPath = drilldownPath.slice(0, -1);
    setDrilldownPath(newPath);
    
    const prevLevel = getPreviousLevel(currentLevel);
    if (prevLevel) {
      setCurrentLevel(prevLevel);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = drilldownPath.slice(0, index);
    setDrilldownPath(newPath);
    
    if (index === 0) {
      setCurrentLevel('product');
    } else {
      const hierarchy = ['product', 'region', 'quarter',  'month'];
      const levelIndex = hierarchy.indexOf(newPath[newPath.length - 1].level);
      setCurrentLevel(hierarchy[levelIndex + 1] as any);
    }
  };

  const breadcrumbItems = [
    { level: 'product', value: 'All Products' },
    ...drilldownPath
  ];

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
        <ReactECharts
          option={chartOption}
          style={{ height: '400px', width: '100%', maxWidth: '800px', cursor: 'ns-resize' }}
          onEvents={{
            click: handleChartClick
          }}
          onChartReady={(chart) => {
            // Add wheel event listener to the chart DOM element
            const chartDom = chart.getDom();
            chartDom.addEventListener('wheel', (event) => {
              event.preventDefault();
              
              if (event.deltaY > 0) {
                // Scroll down - drill down deeper
                const data = getFilteredData();
                if (data.length > 0) {
                  const nextLevel = getNextLevel(currentLevel);
                  if (nextLevel) {
                    setDrilldownPath([...drilldownPath, { level: currentLevel, value: data[0].name }]);
                    setCurrentLevel(nextLevel);
                  }
                }
              } else {
                // Scroll up - drill up
                handleDrillUp();
              }
            });
          }}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>ECharts Implementation:</strong> Click on bars or scroll up/down to drill down through data hierarchy. 
        Use breadcrumbs to navigate back. Path: Product → Region → Quarter → Month
      </div>
    </div>
  );
};

export default EChartsDemo;
