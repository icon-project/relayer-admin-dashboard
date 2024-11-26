import 'server-only';

import os from 'os';

export interface MemoryMetrics {
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  usedMemoryPercentage: number;
  freeMemoryPercentage: number;
}

export interface NetworkMetrics {
  uploadSpeed: string;
  downloadSpeed: string;
}

export interface SystemMetrics {
  cpuUsage: number;
  memory: MemoryMetrics;
  networkMetrics: NetworkMetrics;
  uptime: string;
  timestamp: number;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

export default async function fetchMetrics(): Promise<SystemMetrics> {
  const cpuUsage = Math.round(os.loadavg()[0] * 100) / 100;
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const usedMemoryPercentage = Math.round((usedMemory / totalMemory) * 10000) / 100;
  const freeMemoryPercentage = Math.round((freeMemory / totalMemory) * 10000) / 100;
  const uptime = formatUptime(os.uptime());
  const timestamp = Date.now();

  const networkMetrics: NetworkMetrics = { uploadSpeed: 'placeholder', downloadSpeed: 'placeholder' };

  return {
    cpuUsage,
    memory: {
      totalMemory,
      usedMemory,
      freeMemory,
      usedMemoryPercentage,
      freeMemoryPercentage,
    },
    networkMetrics,
    uptime,
    timestamp,
  };
}