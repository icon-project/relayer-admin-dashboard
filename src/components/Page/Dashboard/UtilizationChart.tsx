'use client'

import Loading from '@/components/Loading/Loading';
import useComputedStyle from '@/hooks/use-computed-style';
import useDictionary from '@/locales/dictionary-hook';
import { SystemMetrics } from '@/utils/metrics';
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { FC, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
interface UtilizationChartProps {
  metrics: SystemMetrics[] | null;
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)


const UtilizationChart: FC<UtilizationChartProps> = ({ metrics }) => {
  const dict = useDictionary();
  const borderColor = useComputedStyle('--bs-border-color');
  const bodyColor = useComputedStyle('--bs-body-color');

  if (!metrics || metrics.length === 0) {
    return <Loading />;
  }

  const labels = metrics.map(metric => formatTimestamp(metric.timestamp));
  const cpuData = metrics.map(metric => metric.cpuUsage);
  const memoryData = metrics.map(metric => metric.memory.usedMemoryPercentage);

  return (
    <Line
      data={{
        labels,
        datasets: [{
          label: 'CPU Usage',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderColor: 'rgba(13, 202, 240, 1)',
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: cpuData,
          fill: true,
        }, {
          label: 'Memory Usage',
          borderColor: 'rgba(25, 135, 84, 1)',
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: memoryData,
        }],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          x: {
            grid: {
              color: borderColor,
              drawOnChartArea: false,
            },
            ticks: {
              color: bodyColor,
            },
          },
          y: {
            beginAtZero: true,
            border: {
              color: borderColor,
            },
            grid: {
              color: borderColor,
            },
            max: 100,
            ticks: {
              color: bodyColor,
              maxTicksLimit: 5,
              stepSize: Math.ceil(100 / 20),
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      }}
    />
  );
};

const UtilizationChartContainer: FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        const newMetric = { ...data.data };

        const savedMetrics = JSON.parse(localStorage.getItem('metrics') || '[]');
        savedMetrics.push(newMetric);

        const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
        const filteredMetrics = savedMetrics.filter((metric: SystemMetrics) => metric.timestamp >= fifteenMinutesAgo);

        localStorage.setItem('metrics', JSON.stringify(filteredMetrics));
        setMetrics(filteredMetrics);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    const savedMetrics = JSON.parse(localStorage.getItem('metrics') || '[]');
    const oneMinutesAgo = Date.now() - 1 * 60 * 1000;
    const filteredMetrics = savedMetrics.filter((metric: SystemMetrics) => metric.timestamp >= oneMinutesAgo);
    setMetrics(filteredMetrics);

    const intervalId = setInterval(fetchMetrics, 6000);

    return () => {
      clearInterval(intervalId);
      localStorage.removeItem('metrics');
    };
  }, []);

  return <UtilizationChart metrics={metrics} />;
};

export default UtilizationChartContainer;