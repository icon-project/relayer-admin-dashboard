import { Proxy, ProxyRequest } from "@/utils/proxy";

  export async function GET(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const relayerId = url.searchParams.get('relayerId');
    const proxyRequest: ProxyRequest = {
      relayerId: relayerId || '',
      method: 'GET',
      path: url.pathname,
    }
    const data = Proxy(proxyRequest);
    return Response.json(data);
  }

  export async function POST(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const relayerId = url.searchParams.get('relayerId');
    const body = await req.text();
    const proxyRequest: ProxyRequest = {
      relayerId: relayerId || '',
      method: 'POST',
      body,
      path: url.pathname,
    }
    const data = Proxy(proxyRequest);
    return Response.json(data);
  }
