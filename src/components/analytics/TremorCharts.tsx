
import React from 'react';
import { 
  BarChart as TremorBarChart, 
  AreaChart as TremorAreaChart, 
  DonutChart as TremorDonutChart,
  Card as TremorCard,
  Title,
  Text,
  Flex,
  BadgeDelta,
  DeltaType,
} from '@tremor/react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const AnalyticsCard = ({ title, subtitle, children, className }: ChartCardProps) => (
  <div className={cn("bg-card text-card-foreground rounded-xl border shadow-sm p-6", className)}>
    <div className="mb-4">
      <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    <div className="h-[300px] w-full">
      {children}
    </div>
  </div>
);

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const BarChart = ({ 
  data, 
  index, 
  categories, 
  colors = ["blue"], 
  valueFormatter = (value: number) => `${value}`,
  className 
}: BarChartProps) => (
  <TremorBarChart
    className={cn("h-full w-full", className)}
    data={data}
    index={index}
    categories={categories}
    colors={colors as any}
    valueFormatter={valueFormatter}
    yAxisWidth={48}
    showAnimation={true}
    showLegend={true}
    showGridLines={true}
    noDataText="Sem dados disponíveis"
  />
);

interface AreaChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const AreaChart = ({ 
  data, 
  index, 
  categories, 
  colors = ["blue"], 
  valueFormatter = (value: number) => `${value}`,
  className 
}: AreaChartProps) => (
  <TremorAreaChart
    className={cn("h-full w-full", className)}
    data={data}
    index={index}
    categories={categories}
    colors={colors as any}
    valueFormatter={valueFormatter}
    yAxisWidth={48}
    showAnimation={true}
    showLegend={true}
    showGridLines={true}
    curveType="monotone"
  />
);

interface DonutChartProps {
  data: any[];
  index: string;
  category: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const DonutChart = ({ 
  data, 
  index, 
  category, 
  colors = ["blue", "cyan", "indigo", "violet", "slate"], 
  valueFormatter = (value: number) => `${value}`,
  className 
}: DonutChartProps) => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <TremorDonutChart
      className={cn("h-48 w-full", className)}
      data={data}
      index={index}
      category={category}
      colors={colors as any}
      valueFormatter={valueFormatter}
      showAnimation={true}
      variant="donut"
    />
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
      {data.map((item, idx) => (
        <div key={item[index]} className="flex items-center space-x-2">
          <div 
            className={cn(
              "h-3 w-3 rounded-full",
              `bg-${colors[idx % colors.length]}-500`
            )} 
          />
          <span className="text-xs font-medium truncate">
            {item[index]} ({valueFormatter(item[category])})
          </span>
        </div>
      ))}
    </div>
  </div>
);
