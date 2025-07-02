import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import D3ChartDemo from "./charts/D3ChartDemo";
import EChartsDemo from "./charts/EChartsDemo";
import ApexChartsDemo from "./charts/ApexChartsDemo";
import HighchartsDemo from "./charts/HighchartsDemo";

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

        {/* ApexCharts and Highcharts in cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* ApexCharts - Left Side */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                ApexCharts Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChartsDemo />
            </CardContent>
          </Card>

          {/* Highcharts - Right Side */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                Highcharts Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HighchartsDemo />
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Comparison Table */}
        <div className="mt-12">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                📊 Comprehensive Chart Library Comparison
              </CardTitle>
              <p className="text-center text-gray-600">
                Detailed analysis based on code implementation and performance metrics
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left font-semibold">Metric</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded"></div>
                          D3.js
                        </div>
                      </th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          ECharts
                        </div>
                      </th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          ApexCharts
                        </div>
                      </th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          Highcharts
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">Rendering Time</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Slow</Badge>
                        <div className="text-xs text-gray-500 mt-1">(300–600ms)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Fast</Badge>
                        <div className="text-xs text-gray-500 mt-1">(60–120ms)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Fast</Badge>
                        <div className="text-xs text-gray-500 mt-1">(80–160ms)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Fast</Badge>
                        <div className="text-xs text-gray-500 mt-1">(80–160ms)</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">Customization</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Full Control)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">Learning Curve</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">High</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">Development Speed</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Slow</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Fast</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Fast</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">Bundle Size</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">(~500KB)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">(~300KB)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">(~150KB)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">(~250KB)</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">Accessibility Support</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">(WCAG Compliant)</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">Community Support</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Large community)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Large community)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Growing community)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Commercial support)</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">Debugging Effort</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Manual debugging)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Dev tools available)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Dev tools available)</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">(Dev tools available)</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-medium">License / Cost</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Free</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Free</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Free</Badge>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Paid</Badge>
                        <div className="text-xs text-gray-500 mt-1">~$349/year (SaaS plan)</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChartComparison;
