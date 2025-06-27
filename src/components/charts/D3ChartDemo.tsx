
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { sampleData, aggregateDataByDimension } from '@/data/sampleData';

const D3ChartDemo = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drilldownPath, setDrilldownPath] = useState<Array<{level: string, value: string}>>([]);
  const [currentLevel, setCurrentLevel] = useState<'product' | 'month' | 'quarter' | 'region'>('product');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

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
    const svg = svgRef.current;
    if (!svg) return;
    
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    
    // Create main group with zoom and pan
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mainGroup.setAttribute('transform', `translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`);
    svg.appendChild(mainGroup);
    
    const maxValue = Math.max(...data.map(d => d.revenue));
    const xScale = (index: number) => margin.left + (index * chartWidth) / data.length;
    const yScale = (value: number) => margin.top + chartHeight - (value / maxValue) * chartHeight;
    const barWidth = chartWidth / data.length * 0.8;
    
    const colors = ['#ff7300', '#ff8c42', '#ffa85c', '#ffbc7a', '#ffd09b', '#ffe4be'];
    
    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.revenue / maxValue) * chartHeight;
      const x = xScale(index);
      const y = yScale(item.revenue);
      
      // Bar group for click handling
      const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      barGroup.style.cursor = 'pointer';
      barGroup.addEventListener('click', () => handleDrillDown(item.name));
      
      // Bar rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', colors[index % colors.length]);
      rect.setAttribute('stroke', '#fff');
      rect.setAttribute('stroke-width', '2');
      rect.setAttribute('class', 'hover:opacity-80 transition-opacity');
      
      // Hover effects
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('opacity', '0.8');
        rect.setAttribute('transform', 'scale(1.02)');
        rect.setAttribute('transform-origin', `${x + barWidth/2} ${y + barHeight/2}`);
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('opacity', '1');
        rect.setAttribute('transform', 'scale(1)');
      });
      
      barGroup.appendChild(rect);
      
      // Value label
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', (x + barWidth/2).toString());
      valueText.setAttribute('y', (y - 5).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '12');
      valueText.setAttribute('fill', '#333');
      valueText.setAttribute('pointer-events', 'none');
      valueText.textContent = `$${item.revenue.toLocaleString()}`;
      barGroup.appendChild(valueText);
      
      // Name label
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', (x + barWidth/2).toString());
      nameText.setAttribute('y', (margin.top + chartHeight + 20).toString());
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size', '11');
      nameText.setAttribute('fill', '#666');
      nameText.setAttribute('transform', `rotate(-45, ${x + barWidth/2}, ${margin.top + chartHeight + 20})`);
      nameText.setAttribute('pointer-events', 'none');
      nameText.textContent = item.name;
      barGroup.appendChild(nameText);
      
      mainGroup.appendChild(barGroup);
    });
    
    // Title
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    const pathString = drilldownPath.length > 0 ? ` > ${drilldownPath.map(p => p.value).join(' > ')}` : '';
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width/2).toString());
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = `Revenue by ${levelName}${pathString}`;
    svg.appendChild(title);
    
    // Axes
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left.toString());
    yAxis.setAttribute('y1', margin.top.toString());
    yAxis.setAttribute('x2', margin.left.toString());
    yAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    yAxis.setAttribute('stroke', '#ccc');
    yAxis.setAttribute('stroke-width', '1');
    mainGroup.appendChild(yAxis);
    
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left.toString());
    xAxis.setAttribute('y1', (margin.top + chartHeight).toString());
    xAxis.setAttribute('x2', (margin.left + chartWidth).toString());
    xAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    xAxis.setAttribute('stroke', '#ccc');
    xAxis.setAttribute('stroke-width', '1');
    mainGroup.appendChild(xAxis);
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

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    
    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;
    
    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
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
        <svg 
          ref={svgRef}
          className="border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing"
          style={{ maxWidth: '100%', height: 'auto' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>D3.js-style Implementation:</strong> Click on bars to drill down through the data hierarchy. 
        Drag to pan and use mouse wheel to zoom. Path: Product → Month → Quarter → Region
      </div>
    </div>
  );
};

export default D3ChartDemo;
