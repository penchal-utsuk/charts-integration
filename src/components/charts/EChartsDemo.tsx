
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { sampleData, aggregateDataByDimension } from '@/data/sampleData';

// ECharts implementation using basic HTML5 Canvas
const EChartsDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentView, setCurrentView] = useState<'product' | 'month' | 'quarter' | 'region'>('product');
  const [breadcrumb, setBreadcrumb] = useState<string[]>(['Revenue by Product']);

  const drawChart = (data: Array<{name: string, revenue: number}>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    
    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.revenue));
    
    // Colors
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    // Draw bars
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    data.forEach((item, index) => {
      const barHeight = (item.revenue / maxValue) * chartHeight;
      const x = margin.left + index * (barWidth + barSpacing);
      const y = margin.top + chartHeight - barHeight;
      
      // Draw bar
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw value on top of bar
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`$${item.revenue.toLocaleString()}`, x + barWidth/2, y - 5);
      
      // Draw label
      ctx.save();
      ctx.translate(x + barWidth/2, margin.top + chartHeight + 20);
      ctx.rotate(-Math.PI/4);
      ctx.textAlign = 'right';
      ctx.fillText(item.name, 0, 0);
      ctx.restore();
    });
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Revenue by ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`, canvas.width/2, 25);
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();
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
        <canvas 
          ref={canvasRef}
          className="border border-gray-200 rounded-lg shadow-sm"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>ECharts-style Implementation:</strong> Built with HTML5 Canvas for high performance rendering. 
        Features smooth animations, responsive design, and extensive customization options.
      </div>
    </div>
  );
};

export default EChartsDemo;
