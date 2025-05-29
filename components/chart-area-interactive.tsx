"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", completed: 15, cancelled: 2, noShow: 1 },
  { date: "2024-04-02", completed: 12, cancelled: 3, noShow: 0 },
  { date: "2024-04-03", completed: 18, cancelled: 1, noShow: 2 },
  { date: "2024-04-04", completed: 20, cancelled: 2, noShow: 1 },
  { date: "2024-04-05", completed: 16, cancelled: 4, noShow: 2 },
  { date: "2024-04-06", completed: 8, cancelled: 1, noShow: 0 },
  { date: "2024-04-07", completed: 5, cancelled: 2, noShow: 1 },
  { date: "2024-04-08", completed: 22, cancelled: 3, noShow: 1 },
  { date: "2024-04-09", completed: 19, cancelled: 2, noShow: 0 },
  { date: "2024-04-10", completed: 17, cancelled: 1, noShow: 2 },
  { date: "2024-04-11", completed: 21, cancelled: 2, noShow: 1 },
  { date: "2024-04-12", completed: 18, cancelled: 3, noShow: 0 },
  { date: "2024-04-13", completed: 9, cancelled: 1, noShow: 1 },
  { date: "2024-04-14", completed: 7, cancelled: 2, noShow: 0 },
  { date: "2024-04-15", completed: 20, cancelled: 1, noShow: 2 },
  { date: "2024-04-16", completed: 23, cancelled: 2, noShow: 1 },
  { date: "2024-04-17", completed: 19, cancelled: 3, noShow: 0 },
  { date: "2024-04-18", completed: 21, cancelled: 1, noShow: 2 },
  { date: "2024-04-19", completed: 17, cancelled: 2, noShow: 1 },
  { date: "2024-04-20", completed: 10, cancelled: 1, noShow: 0 },
  { date: "2024-04-21", completed: 8, cancelled: 2, noShow: 1 },
  { date: "2024-04-22", completed: 22, cancelled: 1, noShow: 2 },
  { date: "2024-04-23", completed: 24, cancelled: 2, noShow: 1 },
  { date: "2024-04-24", completed: 20, cancelled: 3, noShow: 0 },
  { date: "2024-04-25", completed: 18, cancelled: 1, noShow: 2 },
  { date: "2024-04-26", completed: 21, cancelled: 2, noShow: 1 },
  { date: "2024-04-27", completed: 15, cancelled: 1, noShow: 0 },
  { date: "2024-04-28", completed: 9, cancelled: 2, noShow: 1 },
  { date: "2024-04-29", completed: 23, cancelled: 1, noShow: 2 },
  { date: "2024-04-30", completed: 25, cancelled: 2, noShow: 1 },
  { date: "2024-05-01", completed: 19, cancelled: 3, noShow: 0 },
  { date: "2024-05-02", completed: 22, cancelled: 1, noShow: 2 },
  { date: "2024-05-03", completed: 20, cancelled: 2, noShow: 1 },
  { date: "2024-05-04", completed: 12, cancelled: 1, noShow: 0 },
  { date: "2024-05-05", completed: 8, cancelled: 2, noShow: 1 },
  { date: "2024-05-06", completed: 24, cancelled: 1, noShow: 2 },
  { date: "2024-05-07", completed: 26, cancelled: 2, noShow: 1 },
  { date: "2024-05-08", completed: 21, cancelled: 3, noShow: 0 },
  { date: "2024-05-09", completed: 19, cancelled: 1, noShow: 2 },
  { date: "2024-05-10", completed: 23, cancelled: 2, noShow: 1 },
  { date: "2024-05-11", completed: 16, cancelled: 1, noShow: 0 },
  { date: "2024-05-12", completed: 10, cancelled: 2, noShow: 1 },
  { date: "2024-05-13", completed: 25, cancelled: 1, noShow: 2 },
  { date: "2024-05-14", completed: 27, cancelled: 2, noShow: 1 },
  { date: "2024-05-15", completed: 22, cancelled: 3, noShow: 0 },
  { date: "2024-05-16", completed: 20, cancelled: 1, noShow: 2 },
  { date: "2024-05-17", completed: 24, cancelled: 2, noShow: 1 },
  { date: "2024-05-18", completed: 17, cancelled: 1, noShow: 0 },
  { date: "2024-05-19", completed: 11, cancelled: 2, noShow: 1 },
  { date: "2024-05-20", completed: 26, cancelled: 1, noShow: 2 },
  { date: "2024-05-21", completed: 28, cancelled: 2, noShow: 1 },
  { date: "2024-05-22", completed: 23, cancelled: 3, noShow: 0 },
  { date: "2024-05-23", completed: 21, cancelled: 1, noShow: 2 },
  { date: "2024-05-24", completed: 25, cancelled: 2, noShow: 1 },
  { date: "2024-05-25", completed: 18, cancelled: 1, noShow: 0 },
  { date: "2024-05-26", completed: 12, cancelled: 2, noShow: 1 },
  { date: "2024-05-27", completed: 27, cancelled: 1, noShow: 2 },
  { date: "2024-05-28", completed: 29, cancelled: 2, noShow: 1 },
  { date: "2024-05-29", completed: 24, cancelled: 3, noShow: 0 },
  { date: "2024-05-30", completed: 22, cancelled: 1, noShow: 2 },
  { date: "2024-05-31", completed: 26, cancelled: 2, noShow: 1 },
  { date: "2024-06-01", completed: 19, cancelled: 1, noShow: 0 },
  { date: "2024-06-02", completed: 13, cancelled: 2, noShow: 1 },
  { date: "2024-06-03", completed: 28, cancelled: 1, noShow: 2 },
  { date: "2024-06-04", completed: 30, cancelled: 2, noShow: 1 },
  { date: "2024-06-05", completed: 25, cancelled: 3, noShow: 0 },
  { date: "2024-06-06", completed: 23, cancelled: 1, noShow: 2 },
  { date: "2024-06-07", completed: 27, cancelled: 2, noShow: 1 },
  { date: "2024-06-08", completed: 20, cancelled: 1, noShow: 0 },
  { date: "2024-06-09", completed: 14, cancelled: 2, noShow: 1 },
  { date: "2024-06-10", completed: 29, cancelled: 1, noShow: 2 },
  { date: "2024-06-11", completed: 31, cancelled: 2, noShow: 1 },
  { date: "2024-06-12", completed: 26, cancelled: 3, noShow: 0 },
  { date: "2024-06-13", completed: 24, cancelled: 1, noShow: 2 },
  { date: "2024-06-14", completed: 28, cancelled: 2, noShow: 1 },
  { date: "2024-06-15", completed: 21, cancelled: 1, noShow: 0 },
  { date: "2024-06-16", completed: 15, cancelled: 2, noShow: 1 },
  { date: "2024-06-17", completed: 30, cancelled: 1, noShow: 2 },
  { date: "2024-06-18", completed: 32, cancelled: 2, noShow: 1 },
  { date: "2024-06-19", completed: 27, cancelled: 3, noShow: 0 },
  { date: "2024-06-20", completed: 25, cancelled: 1, noShow: 2 },
  { date: "2024-06-21", completed: 29, cancelled: 2, noShow: 1 },
  { date: "2024-06-22", completed: 22, cancelled: 1, noShow: 0 },
  { date: "2024-06-23", completed: 16, cancelled: 2, noShow: 1 },
  { date: "2024-06-24", completed: 31, cancelled: 1, noShow: 2 },
  { date: "2024-06-25", completed: 33, cancelled: 2, noShow: 1 },
  { date: "2024-06-26", completed: 28, cancelled: 3, noShow: 0 },
  { date: "2024-06-27", completed: 26, cancelled: 1, noShow: 2 },
  { date: "2024-06-28", completed: 30, cancelled: 2, noShow: 1 },
  { date: "2024-06-29", completed: 23, cancelled: 1, noShow: 0 },
  { date: "2024-06-30", completed: 17, cancelled: 2, noShow: 1 },
]

const chartConfig = {
  completed: {
    label: "Completed Appointments",
    color: "hsl(142, 76%, 36%)",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(0, 84%, 60%)",
  },
  noShow: {
    label: "No Shows",
    color: "hsl(38, 92%, 50%)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  // Función para obtener el texto de descripción según el rango
  const getDescriptionText = (range: string) => {
    switch (range) {
      case "7d":
        return "Appointment status overview for the last 7 days"
      case "30d":
        return "Appointment status overview for the last 30 days"
      case "90d":
      default:
        return "Appointment status overview for the last 3 months"
    }
  }

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Appointment Analytics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {getDescriptionText(timeRange)}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "7d" 
              ? "Last 7 days" 
              : timeRange === "30d" 
                ? "Last 30 days" 
                : "Last 3 months"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(142, 76%, 36%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(142, 76%, 36%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCancelled" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(0, 84%, 60%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(0, 84%, 60%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillNoShow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(38, 92%, 50%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(38, 92%, 50%)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="completed"
              type="natural"
              fill="url(#fillCompleted)"
              stroke="var(--color-completed)"
              stackId="a"
            />
            <Area
              dataKey="cancelled"
              type="natural"
              fill="url(#fillCancelled)"
              stroke="var(--color-cancelled)"
              stackId="a"
            />
            <Area
              dataKey="noShow"
              type="natural"
              fill="url(#fillNoShow)"
              stroke="var(--color-noShow)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
