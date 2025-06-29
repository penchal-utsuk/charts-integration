import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import D3ChartDemo from './charts/D3ChartDemo';
import EChartsDemo from './charts/EChartsDemo';
import ApexChartsDemo from './charts/ApexChartsDemo';
import HighchartsDemo from './charts/HighchartsDemo';

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
            D3.js vs ECharts vs ApexCharts vs Highcharts - Complete Comparison
          </p>
        </div>

        {/* D3.js and ECharts in cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
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

        {/* ApexCharts - Full Page */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ApexCharts Implementation
            </h2>
            <p className="text-lg text-gray-600">
              Modern chart library with smooth animations and gradient effects
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ApexChartsDemo />
          </div>
        </div>

        {/* Highcharts - Full Page */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Highcharts Implementation
            </h2>
            <p className="text-lg text-gray-600">
              Enterprise-grade charting with advanced features and professional styling
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <HighchartsDemo />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            <strong>Comparison Features:</strong> All charts support drill-down navigation through Product → Region → Quarter → Month hierarchy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-orange-600">D3.js</p>
              <p className="text-xs">Custom SVG rendering with interactive tooltips and hover effects</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-red-600">ECharts</p>
              <p className="text-xs">Built-in chart library with professional styling and animations</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-green-600">ApexCharts</p>
              <p className="text-xs">Modern chart library with smooth animations and gradient effects</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-blue-600">Highcharts</p>
              <p className="text-xs">Enterprise-grade charting with advanced features and customization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartComparison;
