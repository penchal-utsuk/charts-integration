
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { sampleData, aggregateDataByDimension } from '@/data/sampleData';

// Highcharts-style implementation
const HighchartsDemo = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'product' | 'month' | 'quarter' | 'region'>('product');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Revenue by Product']);

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
    chartDiv.style.backgroundColor = '#ffffff';
    chartDiv.style.border = '1px solid #e5e7eb';
    chartDiv.style.borderRadius = '8px';
    container.appendChild(chartDiv);
    
    // Create SVG
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
    
    // Highcharts-style colors
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
    
    // Chart title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width/2).toString());
    title.setAttribute('y', '30');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '18');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333333');
    title.textContent = `Revenue by ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`;
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
      svg.appendChild(gridLine);
    }
    
    // Bars
    data.forEach((item, index) => {
      const barHeight = (item.revenue / maxValue) * chartHeight;
      const x = margin.left + index * (barWidth + barSpacing);
      const y = margin.top + chartHeight - barHeight;
      
      // Bar
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', colors[index % colors.length]);
      rect.setAttribute('stroke', '#ffffff');
      rect.setAttribute('stroke-width', '1');
      rect.style.cursor = 'pointer';
      
      // Hover effect
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('fill-opacity', '0.8');
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('fill-opacity', '1');
      });
      
      svg.appendChild(rect);
      
      // Value label
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', (x + barWidth/2).toString());
      valueText.setAttribute('y', (y - 8).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '12');
      valueText.setAttribute('font-weight', 'bold');
      valueText.setAttribute('fill', '#666666');
      valueText.textContent = `$${item.revenue.toLocaleString()}`;
      svg.appendChild(valueText);
      
      // Category label
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', (x + barWidth/2).toString());
      nameText.setAttribute('y', (margin.top + chartHeight + 25).toString());
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size', '11');
      nameText.setAttribute('fill', '#666666');
      nameText.setAttribute('transform', `rotate(-30, ${x + barWidth/2}, ${margin.top + chartHeight + 25})`);
      nameText.textContent = item.name;
      svg.appendChild(nameText);
    });
    
    // Axes
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', margin.left.toString());
    yAxis.setAttribute('y1', margin.top.toString());
    yAxis.setAttribute('x2', margin.left.toString());
    yAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    yAxis.setAttribute('stroke', '#cccccc');
    yAxis.setAttribute('stroke-width', '2');
    svg.appendChild(yAxis);
    
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', margin.left.toString());
    xAxis.setAttribute('y1', (margin.top + chartHeight).toString());
    xAxis.setAttribute('x2', (margin.left + chartWidth).toString());
    xAxis.setAttribute('y2', (margin.top + chartHeight).toString());
    xAxis.setAttribute('stroke', '#cccccc');
    xAxis.setAttribute('stroke-width', '2');
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
        <div ref={chartRef} />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>Highcharts-style Implementation:</strong> Enterprise-grade charting with polished styling, 
        smooth interactions, and comprehensive theming options. Perfect for business dashboards.
      </div>
    </div>
  );
};

export default HighchartsDemo;
