
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { sampleData, aggregateDataByDimension } from '@/data/sampleData';

const HighchartsDemo = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [drilldownPath, setDrilldownPath] = useState<Array<{level: string, value: string}>>([]);
  const [currentLevel, setCurrentLevel] = useState<'product' | 'month' | 'quarter' | 'region'>('product');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const getNextLevel = (current: string): 'product' | 'month' | 'quarter' | 'region' | null => {
    const hierarchy = ['product', 'month', 'quarter', 'region'];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex < hierarchy.length - 1 ? hierarchy[currentIndex + 1] as any : null;
  };

  const getFilteredData = () => {
    let filteredData = [...sampleData];
    
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
    chartDiv.style.border = '1px solid #e5e7eb';
    chartDiv.style.borderRadius = '8px';
    chartDiv.style.overflow = 'hidden';
    container.appendChild(chartDiv);
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.fontFamily = 'Arial, sans-serif';
    chartDiv.appendChild(svg);
    
    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 40, bottom: 100, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Create zoom group
    const zoomGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    zoomGroup.setAttribute('transform', `translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`);
    svg.appendChild(zoomGroup);
    
    const colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80'];
    const maxValue = Math.max(...data.map(d => d.revenue));
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length * 0.4;
    
    // Background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', '#ffffff');
    svg.appendChild(background);
    
    // Title
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
    
    // Grid lines
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (chartHeight / 5) * i;
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', margin.left.toString());
      gridLine.setAttribute('y1', y.toString());
      gridLine.setAttribute('x2', (margin.left + chartWidth).toString());
      gridLine.setAttribute('y2', y.toString());
      gridLine.setAttribute('stroke', '#e6e6e6');
      gridLine.setAttribute('stroke-width', '1');
      zoomGroup.appendChild(gridLine);
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
      
      // Bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', colors[index % colors.length]);
      rect.setAttribute('stroke', '#ffffff');
      rect.setAttribute('stroke-width', '1');
      rect.setAttribute('rx', '3');
      rect.setAttribute('ry', '3');
      
      // Hover effects
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('fill-opacity', '0.8');
        rect.style.transform = 'scale(1.02)';
        rect.style.transformOrigin = `${x + barWidth/2}px ${y + barHeight/2}px`;
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('fill-opacity', '1');
        rect.style.transform = 'scale(1)';
      });
      
      barGroup.appendChild(rect);
      
      // Value label
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', (x + barWidth/2).toString());
      valueText.setAttribute('y', (y - 8).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '12');
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
      
      zoomGroup.appendChild(barGroup);
    });
    
    // Axes
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left.toString());
    yAxis.setAttribute('y1', margin.top.toString());
    yAxis.setAttribute('x2', margin.left.toString());
    yAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    yAxis.setAttribute('stroke', '#cccccc');
    yAxis.setAttribute('stroke-width', '2');
    zoomGroup.appendChild(yAxis);
    
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left.toString());
    xAxis.setAttribute('y1', (margin.top + chartHeight).toString());
    xAxis.setAttribute('x2', (margin.left + chartWidth).toString());
    xAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    xAxis.setAttribute('stroke', '#cccccc');
    xAxis.setAttribute('stroke-width', '2');
    zoomGroup.appendChild(xAxis);
  };

  const handleDrillDown = (value: string) => {
    const nextLevel = getNextLevel(currentLevel);
    if (!nextLevel) return;
    
    setDrilldownPath([...drilldownPath, { level: currentLevel, value }]);
    setCurrentLevel(nextLevel);
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
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  useEffect(() => {
    const data = getFilteredData();
    drawChart(data);
  }, [currentLevel, drilldownPath, zoomLevel, panOffset]);

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(-0.2)}
            className="flex items-center gap-1"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.2)}
            className="flex items-center gap-1"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
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
        <div ref={chartRef} />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>Highcharts-style Implementation:</strong> Click on bars to drill down through the data hierarchy. 
        Enterprise-grade styling with zoom controls. Path: Product → Month → Quarter → Region
      </div>
    </div>
  );
};

export default HighchartsDemo;
