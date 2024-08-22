import { Proxy, ProxyRequest } from "@/utils/relayer";
import { Event, socketManager } from "@/utils/socket-fetch";

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const event = url.searchParams.get('event') as Event;
  const relayerId = url.searchParams.get('relayerId');

  if (!event) {
    return Response.json({ error: 'Missing event parameter' }, { status: 400 });
  }

  if (relayerId) {
    const proxyRequest: ProxyRequest = {
      relayerId,
      args,
      method: req.method,
      body: req.body,
    };
    try {
      const proxyResponse = await Proxy(proxyRequest);
      return Response.json(proxyResponse);
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  } else {
    try {
      switch (event) {
        case Event.GetBlock:
          const chain = url.searchParams.get('chain') || '';
          const all = url.searchParams.get('all') === 'true';
          const data = await socketManager.getBlock(chain, all);
          return Response.json(data);
        case Event.GetMessageList:
          const pagination = JSON.parse(url.searchParams.get('pagination') || '{}');
          const data = await socketManager.getMessageList(chain, pagination);
          return Response.json(data);
        case Event.GetFee:
          const network = url.searchParams.get('network') || '';
          const response = url.searchParams.get('response') === 'true';
          const chain = url.searchParams.get('chain') || '';
          const data = await socketManager.getFee(chain, network, response);
          return Response.json(data);
        case Event.GetLatestHeight:
          const data = await socketManager.getLatestHeight(chain);
          return Response.json(data);
        case Event.GetConfig:
          const chain = url.searchParams.get('chain') || '';
          const data = await socketManager.getConfig(chain);
          return Response.json(data);
        case Event.RelayMessage:
          const data = await socketManager.relayMessage(body.chain, body.sn, body.height);
          return Response.json(data);
        case Event.PruneDB:
          const data = await socketManager.pruneDB();
          return Response.json(data);
        case Event.ClaimFee:
          const data = await socketManager.claimFee(chain);
          return Response.json(data);
        case Event.ListChainInfo:
          const data = await socketManager.listChains(body.chains);
          return Response.json(data);
        case Event.GetChainBalance:
          const chains = JSON.parse(url.searchParams.get('chains') || '[]');
          const data = await socketManager.getChainBalance(chains);
          return Response.json(data);
        default:
          return Response.json({ error: 'Invalid event' }, { status: 400 });
      }
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export { handler as GET, handler as POST };
