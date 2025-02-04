'use client';

import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useStatistics } from '@/hooks/use-statistics';

const chartConfig = {
  grants: {
    label: 'Grants',
  },
  deposited: {
    label: 'Deposited',
    color: '#08c48c',
  },
  delivered: {
    label: 'Delivered',
    color: '#4a2ddd',
  },
  send: {
    label: 'Sent',
    color: '#3498DB',
  },
  pending: {
    label: 'Pending',
    color: '#e7cc5e',
  },
  failed: {
    label: 'Failed',
    color: '#f1006d',
  },
} satisfies ChartConfig;

const BarChartStatus = () => {
  const { grantsByStatus } = useStatistics();

  const chartData = [
    {
      status: 'deposited',
      grants: grantsByStatus.deposited,
      fill: 'var(--color-deposited)',
    },
    {
      status: 'delivered',
      grants: grantsByStatus.delivered,
      fill: 'var(--color-delivered)',
    },
    { status: 'send', grants: grantsByStatus.sent, fill: 'var(--color-send)' },
    {
      status: 'pending',
      grants: grantsByStatus.pending,
      fill: 'var(--color-pending)',
    },
    {
      status: 'failed',
      grants: grantsByStatus.failed,
      fill: 'var(--color-failed)',
    },
  ];

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Grant - Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 15,
            }}
          >
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="grants" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="grants" layout="vertical" radius={5}>
              <LabelList
                dataKey="grants"
                position="right"
                offset={8}
                className="fill-muted-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartStatus;
