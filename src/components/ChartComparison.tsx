import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import D3ChartDemo from './charts/D3ChartDemo';
import EChartsDemo from './charts/EChartsDemo';

const ChartComparison = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chart Library Comparison
          </h1>
          <p className="text-xl text-gray-600">
            Revenue Analysis with Drilldown Capabilities
          </p>
          <p className="text-sm text-gray-500 mt-2">
            D3.js vs ECharts - Side by Side Comparison
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* D3.js Chart - Left Side */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                D3.js Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <D3ChartDemo />
            </CardContent>
          </Card>

          {/* ECharts - Right Side */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                ECharts Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EChartsDemo />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            <strong>Comparison Features:</strong> Both charts support drill-down navigation through Product → Region → Quarter → Month hierarchy.
          </p>
          <p className="mt-2">
            <strong>D3.js:</strong> Custom SVG rendering with interactive tooltips and hover effects.
          </p>
          <p className="mt-1">
            <strong>ECharts:</strong> Built-in chart library with professional styling and animations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartComparison;
