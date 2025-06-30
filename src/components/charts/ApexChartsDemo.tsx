"use client";
import React from "react";
import ReactApexChart from "react-apexcharts";


const ApexChartsBarChart = () => {
  const [state] = React.useState({
    series: [
      {
        name: "PRODUCT A",
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: "PRODUCT B",
        data: [13, 23, 20, 8, 13, 27],
      },
      {
        name: "PRODUCT C",
        data: [11, 17, 15, 15, 21, 14],
      },
      {
        name: "PRODUCT D",
        data: [21, 7, 25, 13, 22, 8],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: "end", // 'around', 'end'
          borderRadiusWhenStacked: "last", // 'all', 'last'
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        type: "datetime",
        categories: [
          "01/01/2011 GMT",
          "01/02/2011 GMT",
          "01/03/2011 GMT",
          "01/04/2011 GMT",
          "01/05/2011 GMT",
          "01/06/2011 GMT",
        ],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  });

  return (
    <div className="w-full">
      {/* Instructions */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          Multi-Level Drill-down:
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>
            � <strong>Level 1:</strong> Revenue by Region → Click any region
          </li>
          <li>
            📈 <strong>Level 2:</strong> Quarterly breakdown → Click any quarter
          </li>
          <li>
            � <strong>Level 3:</strong> Monthly breakdown → Click any month
          </li>
          <li>
            📋 <strong>Level 4:</strong> Weekly breakdown (final level)
          </li>
          <li>
            � <strong>Scroll</strong> to zoom | ✋ <strong>Drag</strong> to pan
          </li>
        </ul>
      </div>

      <div>
        <div id="chart">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    </div>
  );
};

export default ApexChartsBarChart;
