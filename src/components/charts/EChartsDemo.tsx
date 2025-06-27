import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import dataset from '@/data/dataset.json';
import { aggregateDataByDimension } from '@/data/sampleData';

const EChartsDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply pan transformations only
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const chartWidth = canvas.width - margin.left - margin.right;
    const chartHeight = canvas.height - margin.top - margin.bottom;
    
    const maxValue = Math.max(...data.map(d => d.revenue));
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // Store bar positions for click detection
    const barPositions: Array<{x: number, y: number, width: number, height: number, data: any}> = [];
    
    data.forEach((item, index) => {
      const barHeight = (item.revenue / maxValue) * chartHeight;
      const x = margin.left + index * (barWidth + barSpacing);
      const y = margin.top + chartHeight - barHeight;
      
      // Store position for click detection (adjusted for pan)
      barPositions.push({
        x: x + panOffset.x,
        y: y + panOffset.y,
        width: barWidth,
        height: barHeight,
        data: item
      });
      
      // Draw bar with hover effect
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Add border for better visibility
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);
      
      // Value label
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`$${item.revenue.toLocaleString()}`, x + barWidth/2, y - 5);
      
      // Name label
      ctx.save();
      ctx.translate(x + barWidth/2, margin.top + chartHeight + 20);
      ctx.rotate(-Math.PI/4);
      ctx.textAlign = 'right';
      ctx.fillText(item.name, 0, 0);
      ctx.restore();
    });
    
    // Title (not affected by pan)
    ctx.restore();
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    const pathString = drilldownPath.length > 0 ? ` > ${drilldownPath.map(p => p.value).join(' > ')}` : '';
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Revenue by ${levelName}${pathString}`, canvas.width/2, 25);
    
    // Axes (affected by pan)
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.moveTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();
    ctx.restore();
    
    // Store bar positions for click handling
    (canvas as any).barPositions = barPositions;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isDragging) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const barPositions = (canvas as any).barPositions || [];
    
    for (const bar of barPositions) {
      if (x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height) {
        handleDrillDown(bar.data.name);
        break;
      }
    }
  };

  const handleDrillDown = (value: string) => {
    const nextLevel = getNextLevel(currentLevel);
    if (!nextLevel) return;
    
    setDrilldownPath([...drilldownPath, { level: currentLevel, value }]);
    setCurrentLevel(nextLevel);
    setPanOffset({ x: 0, y: 0 }); // Reset pan when drilling down
  };

  const handleDrillUp = () => {
    if (drilldownPath.length === 0) return;
    
    const newPath = drilldownPath.slice(0, -1);
    setDrilldownPath(newPath);
    
    const prevLevel = getPreviousLevel(currentLevel);
    if (prevLevel) {
      setCurrentLevel(prevLevel);
    }
    setPanOffset({ x: 0, y: 0 }); // Reset pan when drilling up
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
    setPanOffset({ x: 0, y: 0 }); // Reset pan when navigating breadcrumbs
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
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

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    
    if (event.deltaY > 0) {
      // Scroll down - drill down deeper
      const data = getFilteredData();
      if (data.length > 0) {
        handleDrillDown(data[0].name); // Drill into first item
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
        <canvas 
          ref={canvasRef}
          className="border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing"
          style={{ maxWidth: '100%', height: 'auto' }}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>ECharts-style Implementation:</strong> Click on bars or use mouse wheel to drill down/up through data hierarchy. 
        Drag to pan within current level. Path: Product → Month → Quarter → Region
      </div>
    </div>
  );
};

export default EChartsDemo;
