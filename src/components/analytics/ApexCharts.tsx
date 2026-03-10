import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const AnalyticsCard = ({ title, subtitle, children, className }: AnalyticsCardProps) => (
  <Card className={cn("overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm", className)}>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-bold tracking-tight">{title}</CardTitle>
      {subtitle && <CardDescription className="text-xs">{subtitle}</CardDescription>}
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

interface MixedChartProps {
  data: {
    name: string;
    appointments: number;
    revenue: number;
  }[];
  height?: number;
}

export const MixedChart = ({ data, height = 350 }: MixedChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categories = data.map(d => d.name);
  const appointmentSeries = data.map(d => d.appointments);
  const revenueSeries = data.map(d => d.revenue);

  const options: ApexCharts.ApexOptions = {
    chart: {
      id: 'mixed-chart',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    stroke: {
      width: [0, 3],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 6,
      },
    },
    fill: {
      opacity: [0.85, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100]
      }
    },
    labels: categories,
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: { size: 6 }
    },
    xaxis: {
      type: 'category',
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: 'Agendamentos', style: { fontWeight: 500 } },
        labels: {
          formatter: (val) => val.toFixed(0),
        }
      },
      {
        opposite: true,
        title: { text: 'Faturamento (R$)', style: { fontWeight: 500 } },
        labels: {
          formatter: (val) => `R$ ${val.toLocaleString('pt-BR')}`,
        }
      }
    ],
    grid: {
      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      strokeDashArray: 4,
    },
    colors: ['#3b82f6', '#10b981'], // blue-500, emerald-500
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -10,
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      shared: true,
      intersect: false,
      y: {
        formatter: (val, { seriesIndex }) => {
          if (seriesIndex === 1) return `R$ ${val.toLocaleString('pt-BR')}`;
          return `${val} agendamentos`;
        }
      }
    }
  };

  const series = [
    {
      name: 'Agendamentos',
      type: 'column',
      data: appointmentSeries
    },
    {
      name: 'Faturamento',
      type: 'line',
      data: revenueSeries
    }
  ];

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="line" height={height} />
    </div>
  );
};

interface RadialBarChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  height?: number;
}

export const RadialBarChart = ({ data, height = 350 }: RadialBarChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const series = data.map(d => d.value);
  const labels = data.map(d => d.label);
  const colors = data.map(d => d.color);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'radialBar',
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
            formatter: (val) => `${val}%`,
          },
          total: {
            show: true,
            label: 'Total',
            formatter: () => {
              const total = series.reduce((a, b) => a + b, 0);
              return `${Math.round(total / series.length)}%`;
            }
          }
        },
        track: {
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        }
      }
    },
    colors: colors,
    labels: labels,
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    stroke: {
      lineCap: 'round'
    }
  };

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="radialBar" height={height} />
    </div>
  );
};

interface SimpleBarChartProps {
  data: any[];
  categories: string[];
  colors?: string[];
  index: string;
  height?: number;
  valueFormatter?: (val: number) => string;
}

export const SimpleBarChart = ({ 
  data, 
  categories, 
  colors = ['#3b82f6', '#10b981', '#f59e0b'], 
  index, 
  height = 350,
  valueFormatter = (val) => val.toString()
}: SimpleBarChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const xCategories = data.map(d => d[index] as string);
  const series = categories.map(cat => ({
    name: cat,
    data: data.map(d => d[cat] as number)
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: xCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => valueFormatter(val)
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (val) => valueFormatter(val)
      }
    },
    grid: {
      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      strokeDashArray: 4,
    },
    colors: colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    }
  };

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="bar" height={height} />
    </div>
  );
};

interface SimpleAreaChartProps {
  data: any[];
  categories: string[];
  colors?: string[];
  index: string;
  height?: number;
  valueFormatter?: (val: number) => string;
}

export const SimpleAreaChart = ({ 
  data, 
  categories, 
  colors = ['#3b82f6', '#10b981'], 
  index, 
  height = 350,
  valueFormatter = (val) => val.toString()
}: SimpleAreaChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const xCategories = data.map(d => d[index] as string);
  const series = categories.map(cat => ({
    name: cat,
    data: data.map(d => d[cat] as number)
  }));

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
    },
    theme: {
      mode: isDark ? 'dark' : 'light',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: xCategories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => valueFormatter(val)
      }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (val) => valueFormatter(val)
      }
    },
    grid: {
      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      strokeDashArray: 4,
    },
    colors: colors,
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    }
  };

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="area" height={height} />
    </div>
  );
};
