import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import dataset from '@/data/dataset.json';
import { aggregateDataByDimension } from '@/data/sampleData';

const ApexChartsDemo = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [drilldownPath, setDrilldownPath] = useState<Array<{level: string, value: string}>>([]);
  const [currentLevel, setCurrentLevel] = useState<'product' | 'month' | 'quarter' | 'region'>('product');
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const getNextLevel = (current: string): 'product' | 'month' | 'quarter' | 'region' | null => {
    const hierarchy = ['product', 'month', 'quarter', 'region'];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex < hierarchy.length - 1 ? hierarchy[currentIndex + 1] as any : null;
  };

  const getPreviousLevel = (current: string): 'product' | 'month' | 'quarter' | 'region' | null => {
    const hierarchy = ['product', 'month', 'quarter', 'region'];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex > 0 ? hierarchy[currentIndex - 1] as any : null;
  };

  const getFilteredData = () => {
    let filteredData = [...dataset];
    
    drilldownPath.forEach(({ level, value }) => {
      if (level === 'product') {
        filteredData = filteredData.filter(item => item.product_name === value);
      } else if (level === 'month') {
        filteredData = filteredData.filter(item => item.month.toString() === value);
      } else if (level === 'quarter') {
        filteredData = filteredData.filter(item => item.quarter.toString() === value);
      } else if (level === 'region') {
        filteredData = filteredData.filter(item => item.region === value);
      }
    });
    
    return aggregateDataByDimension(filteredData, currentLevel);
  };

  const drawChart = (data: Array<{name: string, revenue: number}>) => {
    const container = chartRef.current;
    if (!container) return;
    
    container.innerHTML = '';
    
    const chartDiv = document.createElement('div');
    chartDiv.style.width = '800px';
    chartDiv.style.height = '400px';
    chartDiv.style.position = 'relative';
    chartDiv.style.backgroundColor = '#ffffff';
    chartDiv.style.borderRadius = '12px';
    chartDiv.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    chartDiv.style.padding = '20px';
    chartDiv.style.overflow = 'hidden';
    chartDiv.style.cursor = 'grab';
    container.appendChild(chartDiv);
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    chartDiv.appendChild(svg);
    
    const width = 760;
    const height = 360;
    const margin = { top: 60, right: 40, bottom: 80, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Create pan group
    const panGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    panGroup.setAttribute('transform', `translate(${panOffset.x}, ${panOffset.y})`);
    svg.appendChild(panGroup);
    
    const colors = ['#00E396', '#008FFB', '#FEB019', '#FF4560', '#775DD0', '#FF66C4'];
    const maxValue = Math.max(...data.map(d => d.revenue));
    const barWidth = chartWidth / data.length * 0.7;
    const barSpacing = chartWidth / data.length * 0.3;
    
    // Create gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    colors.forEach((color, index) => {
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', `gradient${index}`);
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '0%');
      gradient.setAttribute('y2', '100%');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', color);
      stop1.setAttribute('stop-opacity', '0.9');
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', color);
      stop2.setAttribute('stop-opacity', '0.3');
      
      gradient.appendChild(stop1);
      gradient.appendChild(stop2);
      defs.appendChild(gradient);
    });
    svg.appendChild(defs);
    
    // Title (outside pan group)
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    const pathString = drilldownPath.length > 0 ? ` > ${drilldownPath.map(p => p.value).join(' > ')}` : '';
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width/2).toString());
    title.setAttribute('y', '35');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '20');
    title.setAttribute('font-weight', '600');
    title.setAttribute('fill', '#373d3f');
    title.textContent = `Revenue by ${levelName}${pathString}`;
    svg.appendChild(title);
    
    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const y = margin.top + (chartHeight / 4) * i;
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', margin.left.toString());
      gridLine.setAttribute('y1', y.toString());
      gridLine.setAttribute('x2', (margin.left + chartWidth).toString());
      gridLine.setAttribute('y2', y.toString());
      gridLine.setAttribute('stroke', '#f1f5f9');
      gridLine.setAttribute('stroke-width', '1');
      gridLine.setAttribute('stroke-dasharray', '3,3');
      panGroup.appendChild(gridLine);
    }
    
    // Bars with drilldown
    data.forEach((item, index) => {
      const barHeight = (item.revenue / maxValue) * chartHeight;
      const x = margin.left + index * (barWidth + barSpacing);
      const y = margin.top + chartHeight - barHeight;
      
      // Bar group for click handling
      const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      barGroup.style.cursor = 'pointer';
      barGroup.addEventListener('click', () => handleDrillDown(item.name));
      
      // Bar with gradient
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', `url(#gradient${index % colors.length})`);
      rect.setAttribute('rx', '4');
      rect.setAttribute('ry', '4');
      rect.style.transition = 'all 0.3s ease';
      
      // ApexCharts-style hover effects
      rect.addEventListener('mouseenter', () => {
        rect.style.transform = 'scale(1.05)';
        rect.style.filter = 'brightness(1.1)';
        rect.style.transformOrigin = `${x + barWidth/2}px ${y + barHeight/2}px`;
      });
      rect.addEventListener('mouseleave', () => {
        rect.style.transform = 'scale(1)';
        rect.style.filter = 'brightness(1)';
      });
      
      barGroup.appendChild(rect);
      
      // Value label
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', (x + barWidth/2).toString());
      valueText.setAttribute('y', (y - 12).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '13');
      valueText.setAttribute('font-weight', '600');
      valueText.setAttribute('fill', '#64748b');
      valueText.setAttribute('pointer-events', 'none');
      valueText.textContent = `$${(item.revenue / 1000).toFixed(1)}k`;
      barGroup.appendChild(valueText);
      
      // Category label
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', (x + barWidth/2).toString());
      nameText.setAttribute('y', (margin.top + chartHeight + 25).toString());
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size', '12');
      nameText.setAttribute('font-weight', '500');
      nameText.setAttribute('fill', '#64748b');
      nameText.setAttribute('transform', `rotate(-25, ${x + barWidth/2}, ${margin.top + chartHeight + 25})`);
      nameText.setAttribute('pointer-events', 'none');
      nameText.textContent = item.name;
      barGroup.appendChild(nameText);
      
      panGroup.appendChild(barGroup);
    });
  };

  const handleDrillDown = (value: string) => {
    const nextLevel = getNextLevel(currentLevel);
    if (!nextLevel) return;
    
    setDrilldownPath([...drilldownPath, { level: currentLevel, value }]);
    setCurrentLevel(nextLevel);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleDrillUp = () => {
    if (drilldownPath.length === 0) return;
    
    const newPath = drilldownPath.slice(0, -1);
    setDrilldownPath(newPath);
    
    const prevLevel = getPreviousLevel(currentLevel);
    if (prevLevel) {
      setCurrentLevel(prevLevel);
    }
    setPanOffset({ x: 0, y: 0 });
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = drilldownPath.slice(0, index);
    setDrilldownPath(newPath);
    
    if (index === 0) {
      setCurrentLevel('product');
    } else {
      const hierarchy = ['product', 'month', 'quarter', 'region'];
      const levelIndex = hierarchy.indexOf(newPath[newPath.length - 1].level);
      setCurrentLevel(hierarchy[levelIndex + 1] as any);
    }
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
    event.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;
    
    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
    event.currentTarget.style.cursor = 'grab';
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.deltaY > 0) {
      // Scroll down - drill down deeper
      const data = getFilteredData();
      if (data.length > 0) {
        handleDrillDown(data[0].name);
      }
    } else {
      // Scroll up - drill up
      handleDrillUp();
    }
  };

  useEffect(() => {
    const data = getFilteredData();
    drawChart(data);
  }, [currentLevel, drilldownPath, panOffset]);

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
        <div 
          ref={chartRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>ApexCharts-style Implementation:</strong> Click on bars or use mouse wheel to drill down/up through data hierarchy. 
        Drag to pan within current level. Path: Product → Month → Quarter → Region
      </div>
    </div>
  );
};

export default ApexChartsDemo;
