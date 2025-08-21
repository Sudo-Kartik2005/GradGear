"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { Laptop } from "@/types"

const getCpuScore = (cpu: string): number => {
    const lowerCpu = cpu.toLowerCase();
    if (lowerCpu.includes("m3 pro") || lowerCpu.includes("m3 max")) return 12;
    if (lowerCpu.includes("m3")) return 11;
    if (lowerCpu.includes("m2 pro") || lowerCpu.includes("m2 max")) return 10;
    if (lowerCpu.includes("m2")) return 9;
    if (lowerCpu.includes("m1 pro") || lowerCpu.includes("m1 max")) return 8;
    if (lowerCpu.includes("m1")) return 7;
    if (lowerCpu.includes("i9") || lowerCpu.includes("ryzen 9")) return 10;
    if (lowerCpu.includes("i7") || lowerCpu.includes("ryzen 7")) return 8;
    if (lowerCpu.includes("i5") || lowerCpu.includes("ryzen 5")) return 6;
    if (lowerCpu.includes("i3") || lowerCpu.includes("ryzen 3")) return 4;
    return 2;
  };

  const getGpuScore = (gpu: string): number => {
      const lowerGpu = gpu.toLowerCase();
      if (lowerGpu.includes('rtx 4090')) return 12;
      if (lowerGpu.includes('rtx 4080')) return 11;
      if (lowerGpu.includes('rtx 4070')) return 10;
      if (lowerGpu.includes('rtx 4060')) return 9;
      if (lowerGpu.includes('rtx 3080') || lowerGpu.includes('rtx 4050')) return 8;
      if (lowerGpu.includes('rtx 3070')) return 7;
      if (lowerGpu.includes('rtx 3060') || lowerGpu.includes('rtx 2050')) return 6;
      if (lowerGpu.includes('rtx 3050')) return 5;
      if (lowerGpu.includes('iris xe')) return 4;
      if (lowerGpu.includes('radeon')) return 3;
      if (lowerGpu.includes('integrated') || lowerGpu.includes('uhd')) return 2;
      return 1;
  }

export function ComparisonCharts({ laptops }: { laptops: Laptop[] }) {

  const chartData = laptops.map(laptop => ({
    name: laptop.name.split(' ').slice(0, 3).join(' '), // Shorten name for chart label
    Price: laptop.price,
    RAM: laptop.ram,
    "CPU Score": getCpuScore(laptop.cpu),
    "GPU Score": getGpuScore(laptop.gpu),
    Weight: laptop.weight,
  }));

  const chartConfig = {
    value: {
      label: "Value",
    },
    Price: {
      label: "Price (₹)",
      color: "hsl(var(--primary))",
    },
    RAM: {
      label: "RAM (GB)",
      color: "hsl(var(--primary))",
    },
    "CPU Score": {
      label: "CPU Score",
      color: "hsl(var(--primary))",
    },
    "GPU Score": {
        label: "GPU Score",
        color: "hsl(var(--primary))",
    },
    Weight: {
        label: "Weight (kg)",
        color: "hsl(var(--primary))",
    }
  } satisfies React.ComponentProps<typeof ChartContainer>["config"];

  const charts: (keyof typeof chartConfig)[] = ["Price", "RAM", "CPU Score", "GPU Score", "Weight"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {charts.map(chartKey => (
         <Card key={chartKey} className="shadow-lg">
         <CardHeader>
           <CardTitle>{chartConfig[chartKey].label}</CardTitle>
           <CardDescription>Higher is better, except for Price and Weight.</CardDescription>
         </CardHeader>
         <CardContent>
           <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
             <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
               <CartesianGrid vertical={false} />
               <XAxis
                 dataKey="name"
                 tickLine={false}
                 tickMargin={10}
                 axisLine={false}
                 angle={-45}
                 textAnchor="end"
                 height={60}
                 />
                <YAxis />
               <Tooltip
                 cursor={false}
                 content={<ChartTooltipContent hideLabel />}
               />
               <Bar dataKey={chartKey} fill="var(--color-Price)" radius={8} />
             </BarChart>
           </ChartContainer>
         </CardContent>
       </Card>
      ))}
    </div>
  )
}
