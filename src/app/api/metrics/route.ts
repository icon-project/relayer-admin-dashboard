import fetchMetrics from '@/utils/metrics';

export async function GET() {
  const metrics = await fetchMetrics();
  return Response.json({ data: metrics });
}