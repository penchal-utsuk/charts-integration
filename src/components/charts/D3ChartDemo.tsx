
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { sampleData, aggregateDataByDimension } from '@/data/sampleData';

// D3-style implementation using SVG
const D3ChartDemo = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentView, setCurrentView] = useState<'product' | 'month' | 'quarter' | 'region'>('product');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Revenue by Product']);

  const drawChart = (data: Array<{name: string, revenue: number}>) => {
    const svg = svgRef.current;
    if (!svg) return;
    
    // Clear previous content
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
    
    // Create scales
    const maxValue = Math.max(...data.map(d => d.revenue));
    const xScale = (index: number) => margin.left + (index * chartWidth) / data.length;
    const yScale = (value: number) => margin.top + chartHeight - (value / maxValue) * chartHeight;
    const barWidth = chartWidth / data.length * 0.8;
    
    // Colors
    const colors = ['#ff7300', '#ff8c42', '#ffa85c', '#ffbc7a', '#ffd09b', '#ffe4be'];
    
    // Create chart group
    const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.appendChild(chartGroup);
    
    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.revenue / maxValue) * chartHeight;
      const x = xScale(index);
      const y = yScale(item.revenue);
      
      // Create bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', colors[index % colors.length]);
      rect.setAttribute('class', 'hover:opacity-80 transition-opacity cursor-pointer');
      chartGroup.appendChild(rect);
      
      // Value label
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', (x + barWidth/2).toString());
      valueText.setAttribute('y', (y - 5).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '12');
      valueText.setAttribute('fill', '#333');
      valueText.textContent = `$${item.revenue.toLocaleString()}`;
      chartGroup.appendChild(valueText);
      
      // Name label
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', (x + barWidth/2).toString());
      nameText.setAttribute('y', (margin.top + chartHeight + 20).toString());
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size', '11');
      nameText.setAttribute('fill', '#666');
      nameText.setAttribute('transform', `rotate(-45, ${x + barWidth/2}, ${margin.top + chartHeight + 20})`);
      nameText.textContent = item.name;
      chartGroup.appendChild(nameText);
    });
    
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width/2).toString());
    title.setAttribute('y', '25');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = `Revenue by ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`;
    svg.appendChild(title);
    
    // Axes
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left.toString());
    yAxis.setAttribute('y1', margin.top.toString());
    yAxis.setAttribute('x2', margin.left.toString());
    yAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    yAxis.setAttribute('stroke', '#ccc');
    yAxis.setAttribute('stroke-width', '1');
    svg.appendChild(yAxis);
    
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left.toString());
    xAxis.setAttribute('y1', (margin.top + chartHeight).toString());
    xAxis.setAttribute('x2', (margin.left + chartWidth).toString());
    xAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    xAxis.setAttribute('stroke', '#ccc');
    xAxis.setAttribute('stroke-width', '1');
    svg.appendChild(xAxis);
  };

  const handleDrillDown = (dimension: 'product' | 'month' | 'quarter' | 'region') => {
    setCurrentView(dimension);
    const dimensionName = dimension.charAt(0).toUpperCase() + dimension.slice(1);
    setBreadcrumb([...breadcrumb, `Revenue by ${dimensionName}`]);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentView('product');
      setBreadcrumb(['Revenue by Product']);
    }
  };

  useEffect(() => {
    const data = aggregateDataByDimension(sampleData, currentView);
    drawChart(data);
  }, [currentView]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`text-sm ${index === breadcrumb.length - 1 ? 'font-semibold text-gray-900' : 'text-blue-600 hover:text-blue-800'}`}
              >
                {item}
              </button>
            </React.Fragment>
          ))}
        </div>
        {breadcrumb.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBreadcrumbClick(0)}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Overview
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Button
          variant={currentView === 'product' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleDrillDown('product')}
        >
          By Product
        </Button>
        <Button
          variant={currentView === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleDrillDown('month')}
        >
          By Month
        </Button>
        <Button
          variant={currentView === 'quarter' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleDrillDown('quarter')}
        >
          By Quarter
        </Button>
        <Button
          variant={currentView === 'region' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleDrillDown('region')}
        >
          By Region
        </Button>
      </div>
      
      <div className="flex justify-center">
        <svg 
          ref={svgRef}
          className="border border-gray-200 rounded-lg shadow-sm"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>D3.js-style Implementation:</strong> Built with SVG for scalable vector graphics. 
        Offers maximum flexibility and customization with data-driven document manipulation.
      </div>
    </div>
  );
};

export default D3ChartDemo;
