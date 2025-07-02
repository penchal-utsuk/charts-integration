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
                    {/* Performance Metrics */}
                    <tr className="bg-blue-50">
                      <td className="border border-gray-300 p-3 font-semibold" colSpan={5}>
                        🚀 Performance Metrics
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Render Time (Initial Load)</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">~50-100ms</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">~20-40ms</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">~30-50ms</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">~25-45ms</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Bundle Size Impact</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">~500KB</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">~300KB</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">~150KB</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">~250KB</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Memory Usage</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">DOM manipulation</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Canvas efficient</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Optimized SVG</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Memory pooling</div>
                      </td>
                    </tr>

                    {/* Data Volume Handling */}
                    <tr className="bg-purple-50">
                      <td className="border border-gray-300 p-3 font-semibold" colSpan={5}>
                        📈 Data Volume Handling
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Large Dataset Performance</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">1K-10K points</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">100K+ points</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">50K+ points</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">50K+ points</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Real-time Updates</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Custom control</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Built-in streaming</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">updateSeries API</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">addPoint API</div>
                      </td>
                    </tr>

                    {/* Customization & Interactivity */}
                    <tr className="bg-green-50">
                      <td className="border border-gray-300 p-3 font-semibold" colSpan={5}>
                        🎨 Customization & Interactivity
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Customization Level</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Full control over everything</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Rich configuration options</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Extensive theming</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Professional themes</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Built-in Interactions</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">Manual implementation</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Zoom, pan, brush</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Zoom, pan, select</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Professional interactions</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Animation Support</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Custom transitions</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Built-in animations</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Smooth transitions</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Professional animations</div>
                      </td>
                    </tr>

                    {/* Learning Curve & Ease of Use */}
                    <tr className="bg-orange-50">
                      <td className="border border-gray-300 p-3 font-semibold" colSpan={5}>
                        📚 Learning Curve & Ease of Use
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Learning Curve</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">Requires deep knowledge</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Intuitive configuration</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">Good documentation</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">Commercial docs</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Development Speed</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">Custom everything</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Quick setup</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">React integration</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Rich defaults</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Code Complexity</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">~350 lines</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">~270 lines</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">~360 lines</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">~215 lines</div>
                      </td>
                    </tr>

                    {/* Community Support & Ecosystem */}
                    <tr className="bg-indigo-50">
                      <td className="border border-gray-300 p-3 font-semibold" colSpan={5}>
                        🌟 Community Support & Ecosystem
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">GitHub Stars</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">108K+ stars</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">60K+ stars</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">14K+ stars</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">12K+ stars</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Documentation Quality</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Comprehensive guides</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Multi-language</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Good examples</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Professional docs</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Community Support</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Large community</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Apache foundation</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">Growing community</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Commercial support</div>
                      </td>
                    </tr>

                    {/* Pricing & Licensing */}
                    <tr className="bg-yellow-50">
                      <td className="border border-gray-300 p-3 font-semibold" colSpan={5}>
                        💰 Pricing & Licensing
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">License</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">BSD-3</Badge>
                        <div className="text-xs text-gray-500 mt-1">Free & open source</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Apache 2.0</Badge>
                        <div className="text-xs text-gray-500 mt-1">Free & open source</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">MIT</Badge>
                        <div className="text-xs text-gray-500 mt-1">Free & open source</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Dual</Badge>
                        <div className="text-xs text-gray-500 mt-1">Free for non-commercial</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Commercial Use Cost</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Free</Badge>
                        <div className="text-xs text-gray-500 mt-1">No restrictions</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Free</Badge>
                        <div className="text-xs text-gray-500 mt-1">No restrictions</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Free</Badge>
                        <div className="text-xs text-gray-500 mt-1">No restrictions</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">$590+/dev</Badge>
                        <div className="text-xs text-gray-500 mt-1">Commercial license</div>
                      </td>
                    </tr>

                    {/* Technical Aspects */}
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold" colSpan={5}>
                        🔧 Technical Aspects
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Rendering Engine</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-blue-100 text-blue-800">SVG/Canvas</Badge>
                        <div className="text-xs text-gray-500 mt-1">Manual control</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">Canvas/SVG</Badge>
                        <div className="text-xs text-gray-500 mt-1">Auto-optimized</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-blue-100 text-blue-800">SVG</Badge>
                        <div className="text-xs text-gray-500 mt-1">SVG-based</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-blue-100 text-blue-800">SVG</Badge>
                        <div className="text-xs text-gray-500 mt-1">SVG-based</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Accessibility Support</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">Custom implementation</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">Built-in features</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">ARIA support</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">WCAG compliant</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Debugging & Development</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-red-100 text-red-800">Low</Badge>
                        <div className="text-xs text-gray-500 mt-1">Manual debugging</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">Dev tools available</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                        <div className="text-xs text-gray-500 mt-1">Clear error messages</div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Badge className="bg-green-100 text-green-800">High</Badge>
                        <div className="text-xs text-gray-500 mt-1">Professional tools</div>
                      </td>
                    </tr>

                    {/* Overall Recommendation */}
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <td className="border border-gray-300 p-3 font-semibold" colSpan={5}>
                        🏆 Overall Recommendation
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">Best Use Case</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="font-semibold text-orange-700">Custom Visualizations</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Complex, unique charts requiring full control
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="font-semibold text-red-700">Large Scale Applications</div>
                        <div className="text-xs text-gray-600 mt-1">
                          High-performance dashboards with big data
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="font-semibold text-blue-700">Modern Web Apps</div>
                        <div className="text-xs text-gray-600 mt-1">
                          React apps needing quick, interactive charts
                        </div>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="font-semibold text-green-700">Enterprise Solutions</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Professional apps requiring commercial support
                        </div>
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
