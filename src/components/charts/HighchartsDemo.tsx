import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import dataset from '@/data/dataset.json';
import { aggregateDataByDimension } from '@/data/sampleData';

const HighchartsDemo = () => {
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
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create chart container
    const chartDiv = document.createElement('div');
    chartDiv.style.width = '800px';
    chartDiv.style.height = '400px';
    chartDiv.style.position = 'relative';
    chartDiv.style.backgroundColor = '#fefefe';
    chartDiv.style.border = '1px solid #e0e0e0';
    chartDiv.style.borderRadius = '8px';
    chartDiv.style.overflow = 'hidden';
    chartDiv.style.cursor = 'grab';
    chartDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    container.appendChild(chartDiv);
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.fontFamily = '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif';
    svg.style.fontSize = '12px';
    chartDiv.appendChild(svg);
    
    const width = 800;
    const height = 400;
    const margin = { top: 60, right: 40, bottom: 100, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Create pan group
    const panGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    panGroup.setAttribute('transform', `translate(${panOffset.x}, ${panOffset.y})`);
    svg.appendChild(panGroup);
    
    const colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80'];
    const maxValue = Math.max(...data.map(d => d.revenue));
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length * 0.4;
    
    // Title (outside pan group)
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    const pathString = drilldownPath.length > 0 ? ` > ${drilldownPath.map(p => p.value).join(' > ')}` : '';
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width/2).toString());
    title.setAttribute('y', '30');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333333');
    title.textContent = `Revenue by ${levelName}${pathString}`;
    svg.appendChild(title);
    
    // Background grid
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (chartHeight / 5) * i;
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', margin.left.toString());
      gridLine.setAttribute('y1', y.toString());
      gridLine.setAttribute('x2', (margin.left + chartWidth).toString());
      gridLine.setAttribute('y2', y.toString());
      gridLine.setAttribute('stroke', '#e6e6e6');
      gridLine.setAttribute('stroke-width', '1');
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
      
      // Bar with Highcharts styling
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', colors[index % colors.length]);
      rect.setAttribute('stroke', '#ffffff');
      rect.setAttribute('stroke-width', '1');
      rect.setAttribute('rx', '2');
      rect.setAttribute('ry', '2');
      
      // Highcharts-style hover effects
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('fill-opacity', '0.75');
        rect.setAttribute('stroke-width', '2');
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('fill-opacity', '1');
        rect.setAttribute('stroke-width', '1');
      });
      
      barGroup.appendChild(rect);
      
      // Value label
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', (x + barWidth/2).toString());
      valueText.setAttribute('y', (y - 8).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '11');
      valueText.setAttribute('font-weight', 'bold');
      valueText.setAttribute('fill', '#666666');
      valueText.setAttribute('pointer-events', 'none');
      valueText.textContent = `$${item.revenue.toLocaleString()}`;
      barGroup.appendChild(valueText);
      
      // Category label
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', (x + barWidth/2).toString());
      nameText.setAttribute('y', (margin.top + chartHeight + 25).toString());
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size', '11');
      nameText.setAttribute('fill', '#666666');
      nameText.setAttribute('transform', `rotate(-30, ${x + barWidth/2}, ${margin.top + chartHeight + 25})`);
      nameText.setAttribute('pointer-events', 'none');
      nameText.textContent = item.name;
      barGroup.appendChild(nameText);
      
      panGroup.appendChild(barGroup);
    });
    
    // Axes
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left.toString());
    yAxis.setAttribute('y1', margin.top.toString());
    yAxis.setAttribute('x2', margin.left.toString());
    yAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    yAxis.setAttribute('stroke', '#cccccc');
    yAxis.setAttribute('stroke-width', '2');
    panGroup.appendChild(yAxis);
    
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left.toString());
    xAxis.setAttribute('y1', (margin.top + chartHeight).toString());
    xAxis.setAttribute('x2', (margin.left + chartWidth).toString());
    xAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    xAxis.setAttribute('stroke', '#cccccc');
    xAxis.setAttribute('stroke-width', '2');
    panGroup.appendChild(xAxis);
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
        <strong>Highcharts-style Implementation:</strong> Click on bars or use mouse wheel to drill down/up through data hierarchy. 
        Drag to pan within current level. Path: Product → Month → Quarter → Region
      </div>
    </div>
  );
};

export default HighchartsDemo;
