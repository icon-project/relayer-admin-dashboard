import fetchMetrics from "@/utils/metrics";
import { Proxy, ProxyRequest } from "@/utils/relayer";
import { Event, socketManager } from "@/utils/socket-fetch";
import { cookies } from 'next/headers';


async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const event = url.searchParams.get('event') as Event;
  const cookieStore = cookies();
  const relayerId = cookieStore.get('relayerId');

  if (!event) {
    return Response.json({ error: 'Missing event parameter' }, { status: 400 });
  }

  const chain = url.searchParams.get('chain') || '';

  if (relayerId) {
    const proxyRequest: ProxyRequest = {
      relayerId: relayerId?.value,
      method: req.method,
      body: req?.body,
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
          if (!chain) {
            return Response.json({error: 'Missing chain param'}, { status: 400})
          }
          const all = url.searchParams.get('all') === 'true';
          data = await socketManager.getBlock(chain, all);
          break;
        case Event.GetMessageList:
          data = await socketManager.getMessageList(chain, 10);
          break;
        case Event.GetFee:
          const network = url.searchParams.get('network') || '';
          const response = url.searchParams.get('response') === 'true';
          if (!chain) {
            return Response.json({error: 'Missing chain param'}, { status: 400})
          }
          data = await socketManager.getFee(chain, network, response);
          break;
        case Event.GetLatestHeight:
          data = await socketManager.getLatestHeight(chain);
          break;
        case Event.GetConfig:
          if (!chain) {
            return Response.json({error: 'Missing chain param'}, { status: 400})
          }
          data = await socketManager.getConfig(chain);
          break;
        case Event.RelayMessage:
          const { chain: nid, fromHeight, toHeight } = await req.json()
          data = await socketManager.relayMessage(nid, fromHeight, toHeight)
          break;
        case Event.PruneDB:
          data = await socketManager.pruneDB();
          break;
        case Event.ClaimFee:
          if (!chain) {
            return Response.json({error: 'Missing chain param'}, { status: 400})
          }
          data = await socketManager.claimFee(chain);
          break;
        case Event.ListChainInfo:
          const { chains: nids } = await req.json()
          data = await socketManager.listChains(nids)
          break;
        case Event.GetChainBalance:
          const chains = await req.json()
          data = await socketManager.getChainBalance(chains);
          break;
        case Event.Metrics:
          data = await fetchMetrics()
          break;
        default:
          return Response.json({ error: 'Invalid event' }, { status: 400 });
      }
      return Response.json(data)
    } catch (error: any) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
}

export { handler as GET, handler as POST };
