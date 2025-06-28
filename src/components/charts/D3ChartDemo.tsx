import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import dataset from '@/data/dataset.json';
import { aggregateDataByDimension } from '@/data/sampleData';

const D3ChartDemo = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drilldownPath, setDrilldownPath] = useState<Array<{level: string, value: string}>>([]);
  const [currentLevel, setCurrentLevel] = useState<'product' | 'region' | 'quarter' | 'month'>('product');

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
      } else if (level === 'month') {
        filteredData = filteredData.filter(item => item.month.toString() === value);
      }
    });
    
    return aggregateDataByDimension(filteredData, currentLevel);
  };

  const chartData = useMemo(() => {
    const data = getFilteredData();
    return data.map(item => ({
      name: currentLevel === 'month' 
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(item.name) - 1] || item.name
        : item.name,
      value: item.revenue,
      originalName: item.name
    }));
  }, [currentLevel, drilldownPath]);

  const drawChart = () => {
    if (!svgRef.current || chartData.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up dimensions
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(chartData.map(d => d.name))
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) || 0])
      .range([height, 0]);

    // Color scale
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

    // Add title
    const levelName = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    const pathString = drilldownPath.length > 0 ? ` > ${drilldownPath.map(p => p.value).join(' > ')}` : '';
    
    svg.append('text')
      .attr('x', (width + margin.left + margin.right) / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(`Revenue by ${levelName}${pathString}`);

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).tickFormat((d: any) => `$${(d / 1000).toFixed(0)}K`));

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Revenue ($)');

    // Bars
    const bars = g.selectAll('.bar')
      .data(chartData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
      .attr('fill', (_, i) => colors[i % colors.length])
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 0.8)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);
        
        // Tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('pointer-events', 'none')
          .style('font-size', '12px');
        
        tooltip.html(`${d.name}<br/>Revenue: $${d.value.toLocaleString()}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', 'none');
        d3.selectAll('.tooltip').remove();
      })
      .on('click', function(event, d) {
        handleDrillDown(d);
      });

    // Value labels on bars
    g.selectAll('.bar-label')
      .data(chartData)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text(d => `$${(d.value / 1000).toFixed(0)}K`);
  };

  const handleDrillDown = (data: any) => {
    const nextLevel = getNextLevel(currentLevel);
    if (!nextLevel) return;
    
    setDrilldownPath([...drilldownPath, { level: currentLevel, value: data.originalName }]);
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
      const hierarchy = ['product', 'region', 'quarter', 'month'];
      const levelIndex = hierarchy.indexOf(newPath[newPath.length - 1].level);
      setCurrentLevel(hierarchy[levelIndex + 1] as any);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.deltaY > 0) {
      // Scroll down - drill down deeper
      if (chartData.length > 0) {
        const nextLevel = getNextLevel(currentLevel);
        if (nextLevel) {
          setDrilldownPath([...drilldownPath, { level: currentLevel, value: chartData[0].originalName }]);
          setCurrentLevel(nextLevel);
        }
      }
    } else {
      // Scroll up - drill up
      handleDrillUp();
    }
  };

  useEffect(() => {
    drawChart();
  }, [chartData]);

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
      
      <div className="flex justify-center" onWheel={handleWheel}>
        <svg 
          ref={svgRef}
          className="border border-gray-200 rounded-lg shadow-sm"
          style={{ cursor: 'ns-resize' }}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-4">
        <strong>D3.js Implementation:</strong> Click on bars or scroll up/down to drill down through data hierarchy. 
        Use breadcrumbs to navigate back. Path: Product → Region → Quarter → Month
      </div>
    </div>
  );
};

export default D3ChartDemo;
