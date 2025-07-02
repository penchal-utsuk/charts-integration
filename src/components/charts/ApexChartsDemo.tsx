"use client";
import React, { useState, useMemo, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import dataset from "@/data/dataset.json";
import { aggregateDataByDimension } from "@/data/sampleData";
import { useChartPerformance } from "@/lib/useChartPerformance";

const ApexChartsDemo = () => {
  const [drilldownPath, setDrilldownPath] = useState<
    Array<{ level: string; value: string }>
  >([]);
  const [currentLevel, setCurrentLevel] = useState<
    "product" | "region" | "quarter" | "month"
  >("product");
  const [perfStats, setPerfStats] = useState<{
    last?: number;
    avg?: number;
    min?: number;
    max?: number;
  } | null>(null);
  const { start, end } = useChartPerformance("ApexCharts", 10);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    start();
  }, [drilldownPath, currentLevel, start]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      end();
    }, 0);
    return () => clearTimeout(timeout);
  }, [drilldownPath, currentLevel, end]);

  const getNextLevel = (
    current: string
  ): "product" | "region" | "quarter" | "month" | null => {
    const hierarchy = ["product", "region", "quarter", "month"];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex < hierarchy.length - 1
      ? (hierarchy[currentIndex + 1] as any)
      : null;
  };

  const getPreviousLevel = (
    current: string
  ): "product" | "region" | "quarter" | "month" | null => {
    const hierarchy = ["product", "region", "quarter", "month"];
    const currentIndex = hierarchy.indexOf(current);
    return currentIndex > 0 ? (hierarchy[currentIndex - 1] as any) : null;
  };

  const getFilteredData = () => {
    let filteredData = Array.isArray(dataset) ? [...dataset] : [];
    drilldownPath.forEach(({ level, value }) => {
      if (level === "product") {
        filteredData = filteredData.filter(
          (item) => item.product_name === value
        );
      } else if (level === "region") {
        filteredData = filteredData.filter((item) => item.region === value);
      } else if (level === "quarter") {
        const quarterNumber = value.replace("Q", "");
        filteredData = filteredData.filter(
          (item) => item.quarter.toString() === quarterNumber
        );
      } else if (level === "month") {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthIndex = monthNames.indexOf(value);
        if (monthIndex !== -1) {
          filteredData = filteredData.filter(
            (item) => item.month === monthIndex + 1
          );
        }
      }
    });
    return aggregateDataByDimension(filteredData, currentLevel);
  };

  const chartData = useMemo(() => {
    const data = getFilteredData();
    const result = data.map((item) => ({
      name: (() => {
        if (currentLevel === "month") {
          if (item.name.startsWith("Month ")) {
            const monthNumber = Number(item.name.replace("Month ", ""));
            if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
              const shortMonthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              return shortMonthNames[monthNumber - 1];
            }
          }
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const shortMonthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const monthIndex = monthNames.indexOf(item.name);
          if (monthIndex !== -1) {
            return shortMonthNames[monthIndex];
          }
          const monthNumber = Number(item.name);
          if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
            return shortMonthNames[monthNumber - 1];
          }
        }
        return item.name;
      })(),
      value: item.revenue,
      originalName: item.name,
    }));
    return result;
  }, [currentLevel, drilldownPath]);

  const chartOptions: ApexOptions = useMemo(() => {
    const levelName =
      currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    const pathString =
      drilldownPath.length > 0
        ? ` > ${drilldownPath.map((p) => p.value).join(" > ")}`
        : "";
    return {
      chart: {
        type: "bar",
        height: 400,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        stacked: true,
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true
        },
        pan: {
          enabled: true
        },
        selection: {
          enabled: true,
          type: 'x'
        },
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const nextLevel = getNextLevel(currentLevel);
            if (!nextLevel) return;
            const clickedBar = chartData[config.dataPointIndex];
            const clickedValue = clickedBar
              ? clickedBar.originalName
              : config.w.globals.categoryLabels[config.dataPointIndex];
            setDrilldownPath([
              ...drilldownPath,
              { level: currentLevel, value: clickedValue },
            ]);
            setCurrentLevel(nextLevel);
          },
        },
      },
      title: {
        text: `Revenue by ${levelName}${pathString}`,
        align: "center",
        style: { fontSize: "16px", fontWeight: "bold" },
      },
      xaxis: {
        categories: chartData.map((item) => item.name),
        labels: { rotate: -45, style: { fontSize: "10px" } },
      },
      yaxis: {
        title: { text: "Revenue ($)" },
        labels: {
          formatter: function (value) {
            return `$${(value / 1000).toFixed(0)}K`;
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          distributed: true,
        },
      },
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#5f27cd",
        "#54a0ff",
        "#00b894",
        "#fdcb6e",
        "#e17055",
        "#00b8d4",
      ],
      dataLabels: {
        enabled: false,
      },
      grid: {
        padding: { left: 20, right: 20 },
      },
    };
  }, [chartData, currentLevel, drilldownPath]);

  const handleBreadcrumbClick = (index: number) => {
    const newPath = drilldownPath.slice(0, index);
    setDrilldownPath(newPath);
    if (index === 0) {
      setCurrentLevel("product");
    } else {
      const hierarchy = ["product", "region", "quarter", "month"];
      const levelIndex = hierarchy.indexOf(newPath[newPath.length - 1].level);
      setCurrentLevel(hierarchy[levelIndex + 1] as any);
    }
  };

  const breadcrumbItems = [
    { level: "product", value: "All Products" },
    ...drilldownPath,
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
                className={`text-sm ${
                  index === breadcrumbItems.length - 1
                    ? "font-semibold text-gray-900"
                    : "text-blue-600 hover:text-blue-800"
                }`}
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
        <div style={{ width: "100%", maxWidth: 800 }}>
          <ReactApexChart
            options={chartOptions}
            series={[
              { name: "Revenue", data: chartData.map((item) => item.value) },
            ]}
            type="bar"
            height={400}
          />
        </div>
      </div>
      {perfStats && (
        <div className="text-xs text-gray-500 mt-2">
          <strong>Chart Load Time:</strong> {perfStats.last?.toFixed(2)} ms
          {perfStats.avg !== undefined && (
            <>
              {" | "}
              <strong>Avg:</strong> {perfStats.avg.toFixed(2)} ms
              {" | "}
              <strong>Min:</strong> {perfStats.min?.toFixed(2)} ms
              {" | "}
              <strong>Max:</strong> {perfStats.max?.toFixed(2)} ms
            </>
          )}
        </div>
      )}
      <div className="text-sm text-gray-600 mt-4">
        <strong>ApexCharts Implementation:</strong> Click on bars to drill down
        through data hierarchy. Use breadcrumbs to navigate back. Path: Product
        → Region → Quarter → Month. Use toolbar to zoom/pan or drag to select area for zooming.
      </div>
    </div>
  );
};

export default ApexChartsDemo;
