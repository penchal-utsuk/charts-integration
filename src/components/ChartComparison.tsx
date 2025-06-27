
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EChartsDemo from './charts/EChartsDemo';
import D3ChartDemo from './charts/D3ChartDemo';
import HighchartsDemo from './charts/HighchartsDemo';
import ApexChartsDemo from './charts/ApexChartsDemo';

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
            ECharts vs D3.js vs Highcharts vs ApexCharts
          </p>
        </div>

        <Tabs defaultValue="echarts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="echarts" className="text-sm font-medium">
              ECharts
            </TabsTrigger>
            <TabsTrigger value="d3" className="text-sm font-medium">
              D3.js
            </TabsTrigger>
            <TabsTrigger value="highcharts" className="text-sm font-medium">
              Highcharts
            </TabsTrigger>
            <TabsTrigger value="apexcharts" className="text-sm font-medium">
              ApexCharts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="echarts">
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
          </TabsContent>

          <TabsContent value="d3">
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
          </TabsContent>

          <TabsContent value="highcharts">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  Highcharts Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HighchartsDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apexcharts">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  ApexCharts Implementation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ApexChartsDemo />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChartComparison;
