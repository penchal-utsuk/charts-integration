
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { sampleData, aggregateDataByDimension } from '@/data/sampleData';

// ApexCharts-style implementation
const ApexChartsDemo = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<'product' | 'month' | 'quarter' | 'region'>('product');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Revenue by Product']);

  const drawChart = (data: Array<{name: string, revenue: number}>) => {
    const container = chartRef.current;
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create chart container with ApexCharts styling
    const chartDiv = document.createElement('div');
    chartDiv.style.width = '800px';
    chartDiv.style.height = '400px';
    chartDiv.style.position = 'relative';
    chartDiv.style.backgroundColor = '#ffffff';
    chartDiv.style.borderRadius = '12px';
    chartDiv.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    chartDiv.style.padding = '20px';
    container.appendChild(chartDiv);
    
    // Create SVG
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
    
    // ApexCharts-style gradient colors
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
    
    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width/2).toString());
    title.setAttribute('y', '35');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '20');
    title.setAttribute('font-weight', '600');
    title.setAttribute('fill', '#373d3f');
    title.textContent = `Revenue by ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`;
    svg.appendChild(title);
    
    // Subtle grid lines
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
      svg.appendChild(gridLine);
    }
    
    // Bars with gradients and animations
    data.forEach((item, index) => {
      const barHeight = (item.revenue / maxValue) * chartHeight;
      const x = margin.left + index * (barWidth + barSpacing);
      const y = margin.top + chartHeight - barHeight;
      
      // Bar with gradient
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', `url(#gradient${index % colors.length})`);
      rect.setAttribute('rx', '4');
      rect.setAttribute('ry', '4');
      rect.style.cursor = 'pointer';
      rect.style.transition = 'all 0.3s ease';
      
      // Hover effects
      rect.addEventListener('mouseenter', () => {
        rect.style.transform = 'scale(1.05)';
        rect.style.filter = 'brightness(1.1)';
      });
      rect.addEventListener('mouseleave', () => {
        rect.style.transform = 'scale(1)';
        rect.style.filter = 'brightness(1)';
      });
      
      svg.appendChild(rect);
      
      // Value label with modern styling
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', (x + barWidth/2).toString());
      valueText.setAttribute('y', (y - 12).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('font-size', '13');
      valueText.setAttribute('font-weight', '600');
      valueText.setAttribute('fill', '#64748b');
      valueText.textContent = `$${(item.revenue / 1000).toFixed(1)}k`;
      svg.appendChild(valueText);
      
      // Category label
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', (x + barWidth/2).toString());
      nameText.setAttribute('y', (margin.top + chartHeight + 25).toString());
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('font-size', '12');
      nameText.setAttribute('font-weight', '500');
      nameText.setAttribute('fill', '#64748b');
      nameText.setAttribute('transform', `rotate(-25, ${x + barWidth/2}, ${margin.top + chartHeight + 25})`);
      nameText.textContent = item.name;
      svg.appendChild(nameText);
    });
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
        <strong>ApexCharts-style Implementation:</strong> Modern, responsive charts with beautiful gradients, 
        smooth animations, and interactive features. Optimized for React applications.
      </div>
    </div>
  );
};

export default ApexChartsDemo;
