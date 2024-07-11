import os from 'os';

interface MemoryMetrics {
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
}

interface NetworkMetrics {
  uploadSpeed: string;
  downloadSpeed: string;
}

interface SystemMetrics {
  cpuUsage: number[];
  memory: MemoryMetrics;
  networkMetrics: NetworkMetrics;
  uptime: number;
}

export default async function fetchMetrics(): Promise<SystemMetrics> {
  const cpuUsage = os.loadavg() // Average CPU Load over 1, 5, and 15 minutes
  const totalMemory = os.totalmem()
  const freeMemory = os.freemem()
  const usedMemory = totalMemory - freeMemory
  const uptime = os.uptime()

  const networkMetrics: NetworkMetrics = { uploadSpeed: 'placeholder', downloadSpeed: 'placeholder' }

  return {
    cpuUsage,
    memory: {
      totalMemory,
      usedMemory,
      freeMemory,
    },
    networkMetrics,
    uptime,
  }
}
