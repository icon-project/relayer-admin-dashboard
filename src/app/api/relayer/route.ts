import { Proxy, ProxyRequest } from "@/utils/proxy";
import { Event, socketManager } from "@/utils/socket-fetch";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const event = url.searchParams.get('event') as Event;
  const relayerId = url.searchParams.get('relayerId');

  if (!event) {
    return Response.json({ error: 'Missing event parameter' }, { status: 400 });
  }

  if (relayerId) {
    const proxyRequest: ProxyRequest = {
      relayerId,
      path: url.pathname,
      method: 'GET',
      body: null,
    };
    try {
      const proxyResponse = await Proxy(proxyRequest);
      return Response.json(proxyResponse);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  } else {
    try {
      let data;
      switch (event) {
        case Event.GetBlock:
          const chain = url.searchParams.get('chain') || '';
          const all = url.searchParams.get('all') === 'true';
          data = await socketManager.getBlock(chain, all);
          break;
        case Event.GetMessageList:
          const pagination = JSON.parse(url.searchParams.get('pagination') || '{}');
          data = await socketManager.getMessageList(chain, pagination);
          break;
        case Event.GetFee:
          const network = url.searchParams.get('network') || '';
          const response = url.searchParams.get('response') === 'true';
          const chain = url.searchParams.get('chain') || '';
          data = await socketManager.getFee(chain, network, response);
          break;
        case Event.GetLatestHeight:
          data = await socketManager.getLatestHeight(chain);
          break;
        case Event.GetBlockRange:
          const fromHeight = parseInt(url.searchParams.get('fromHeight') || '0');
          const toHeight = parseInt(url.searchParams.get('toHeight') || '0');
          data = await socketManager.getBlockRange(chain, fromHeight, toHeight);
          break;
        case Event.GetConfig:
          data = await socketManager.getConfig(chain);
          break;
        case Event.ListChainInfo:
          data = await socketManager.listChains();
          break;
        case Event.GetChainBalance:
          const chains = JSON.parse(url.searchParams.get('chains') || '[]');
          data = await socketManager.getChainBalance(chains);
          break;
        default:
          return Response.json({ error: 'Invalid event' }, { status: 400 });
      }
      return Response.json(data);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const event = url.searchParams.get('event') as Event;
  const relayerId = url.searchParams.get('relayerId');

  if (!event || !req.body) {
    return Response.json({ error: 'Missing event, chain, or body parameter' }, { status: 400 });
  }

  if (relayerId) {
    try {
      const body = await req.json();
      const proxyRequest: ProxyRequest = {
        relayerId,
        path: url.pathname,
        method: 'POST',
        body,
      };
      const proxyResponse = await Proxy(proxyRequest);
      return Response.json(proxyResponse);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  } else {
    try {
      const body = await req.json();
      let data;
      switch (event) {
        case Event.MessageRemove:
          const chain = url.searchParams.get('chain') || '';
          data = await socketManager.removeMessage(chain, body.sn);
          break;
        case Event.RelayMessage:
          data = await socketManager.relayMessage(chain, body.sn, body.height);
          break;
        case Event.PruneDB:
          data = await socketManager.pruneDB();
          break;
        case Event.ClaimFee:
          data = await socketManager.claimFee(chain);
          break;
        default:
          return Response.json({ error: 'Invalid event' }, { status: 400 });
      }
      return Response.json(data);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}