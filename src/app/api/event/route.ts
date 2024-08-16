import { Event, socketManager } from "@/utils/socket-fetch";

async function handleGetEvent(event: string, chain: string, url: URL): Promise<Response> {
  let data;
  switch (event) {
    case Event.GetBlock:
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
}

async function handlePostEvent(event: string, chain: string, body: any): Promise<Response> {
  let data;
  switch (event) {
    case Event.MessageRemove:
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
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const event = url.searchParams.get('event');
  const chain = url.searchParams.get('chain');

  if (!event || !chain) {
    return Response.json({ error: 'Missing event or chain parameter' }, { status: 400 });
  }

  try {
    return await handleGetEvent(event, chain, url);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const event = url.searchParams.get('event');
  const chain = url.searchParams.get('chain');

  if (!event || !chain || !req.body) {
    return Response.json({ error: 'Missing event, chain, or body parameter' }, { status: 400 });
  }

  try {
    const body = await req.json();
    return await handlePostEvent(event, chain, body);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}