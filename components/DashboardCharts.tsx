"use client";

import ReactECharts from "echarts-for-react";
import type { CallbackDataParams, EChartsOption } from "echarts/types/dist/shared";

const baseGrid = { left: 34, right: 12, top: 20, bottom: 24 };
const axisStyle = {
  axisLine: { lineStyle: { color: "rgba(255,255,255,.14)" } },
  axisLabel: { color: "rgba(244,247,251,.62)", fontSize: 10 },
  splitLine: { lineStyle: { color: "rgba(255,255,255,.07)" } },
};

function Chart({ option }: { option: EChartsOption }) {
  return (
    <ReactECharts
      option={option}
      notMerge
      lazyUpdate
      style={{ height: "100%", width: "100%" }}
      opts={{ renderer: "canvas" }}
    />
  );
}

export function HealthTrendChart({
  series,
}: {
  series: Array<{
    id: string;
    label: string;
    unit: string;
    values: Array<{ year: number; value: number }>;
  }>;
}) {
  const years = Array.from(new Set(series.flatMap((item) => item.values.map((value) => value.year))));
  const option: EChartsOption = {
    color: ["#18d690", "#3bc7ff", "#ffbf45", "#ff5c7a"],
    tooltip: { trigger: "axis", backgroundColor: "#171a22", borderColor: "rgba(255,255,255,.14)", textStyle: { color: "#f4f7fb" } },
    legend: { top: 0, right: 4, textStyle: { color: "rgba(244,247,251,.7)", fontSize: 10 } },
    grid: baseGrid,
    xAxis: { type: "category", data: years, ...axisStyle },
    yAxis: { type: "value", ...axisStyle },
    series: series.map((item) => ({
      name: item.label,
      type: "line",
      smooth: true,
      symbolSize: 5,
      data: years.map((year) => item.values.find((value) => value.year === year)?.value ?? null),
    })),
  };
  return <Chart option={option} />;
}

export function InvestmentTreemap({
  data,
}: {
  data: Array<{ name: string; value: number; gain: number; returnPct: number }>;
}) {
  const option: EChartsOption = {
    tooltip: {
      formatter: (params) => {
        const item = (params as CallbackDataParams).data as { name: string; value: number; returnPct: number };
        return `${item.name}<br/>평가 ${Math.round(item.value / 10000).toLocaleString()}만원<br/>수익률 ${item.returnPct}%`;
      },
      backgroundColor: "#171a22",
      borderColor: "rgba(255,255,255,.14)",
      textStyle: { color: "#f4f7fb" },
    },
    series: [
      {
        type: "treemap",
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { color: "#f4f7fb", fontSize: 11, overflow: "truncate" },
        itemStyle: { borderColor: "#08090d", borderWidth: 2, gapWidth: 2 },
        levels: [
          {
            color: ["#18d690", "#3bc7ff", "#ffbf45", "#ff5c7a", "#9b8cff", "#46d6c8"],
            colorSaturation: [0.35, 0.75],
          },
        ],
        data: data.map((item) => ({
          ...item,
          itemStyle: { color: item.gain >= 0 ? undefined : "#ff5c7a" },
        })),
      },
    ],
  };
  return <Chart option={option} />;
}

export function WealthCompositionChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const option: EChartsOption = {
    color: ["#18d690", "#3bc7ff", "#ffbf45", "#ff5c7a", "#9b8cff", "#46d6c8"],
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        const item = params as CallbackDataParams;
        const value = Number(item.value ?? 0);
        return `${item.name}<br/>${Math.round(value / 100000000).toLocaleString()}억`;
      },
      backgroundColor: "#171a22",
      borderColor: "rgba(255,255,255,.14)",
      textStyle: { color: "#f4f7fb" },
    },
    legend: { bottom: 0, left: "center", textStyle: { color: "rgba(244,247,251,.7)", fontSize: 10 } },
    series: [
      {
        name: "Asset",
        type: "pie",
        radius: ["48%", "72%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: true,
        label: { color: "#f4f7fb", fontSize: 10, formatter: "{b}" },
        labelLine: { lineStyle: { color: "rgba(244,247,251,.35)" } },
        data: data.map((item) => ({ name: item.label, value: item.value })),
      },
    ],
  };
  return <Chart option={option} />;
}

export function PensionBarChart({ data }: { data: Array<{ year: number; amount: number }> }) {
  const option: EChartsOption = {
    color: ["#3bc7ff"],
    tooltip: { trigger: "axis", backgroundColor: "#171a22", borderColor: "rgba(255,255,255,.14)", textStyle: { color: "#f4f7fb" } },
    grid: baseGrid,
    xAxis: { type: "category", data: data.map((item) => item.year), ...axisStyle },
    yAxis: { type: "value", ...axisStyle },
    series: [{ type: "bar", barWidth: 9, data: data.map((item) => item.amount / 1000) }],
  };
  return <Chart option={option} />;
}

export function TaxLineChart({ data }: { data: Array<{ year: number; amount: number }> }) {
  const option: EChartsOption = {
    color: ["#ffbf45"],
    tooltip: { trigger: "axis", backgroundColor: "#171a22", borderColor: "rgba(255,255,255,.14)", textStyle: { color: "#f4f7fb" } },
    grid: baseGrid,
    xAxis: { type: "category", data: data.map((item) => item.year), ...axisStyle },
    yAxis: { ...axisStyle, type: "value", axisLabel: { formatter: "{value}", color: "rgba(244,247,251,.62)", fontSize: 10 } },
    series: [{ type: "line", smooth: true, symbolSize: 4, areaStyle: { opacity: 0.12 }, data: data.map((item) => Math.round(item.amount / 1000000)) }],
  };
  return <Chart option={option} />;
}
