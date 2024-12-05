import { getLogs } from '@/utils/docker'
import fetchMetrics from '@/utils/metrics'
import { Proxy, ProxyRequest } from '@/utils/relayer'
import { Event, socketManager } from '@/utils/socket-fetch'
import { cookies } from 'next/headers'

async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url)
    const event = url.searchParams.get('event') as Event
    const cookieStore = cookies()
    const relayerId = url.searchParams.get('relayerId') || cookieStore.get('relayerId')?.value
    if (!event) {
        return Response.json({ error: 'Missing event parameter' }, { status: 400 })
    }

    const chain = url.searchParams.get('chain') || ''

    if (relayerId && relayerId != 'self') {
        try {
            const proxyRequest: ProxyRequest = {
                relayerId: relayerId,
                method: req.method,
                body: req.method === 'POST' ? await req.json() : undefined,
                args: Object.fromEntries(url.searchParams),
            }
            const proxyResponse = await Proxy(proxyRequest)
            return Response.json(proxyResponse)
        } catch (error: any) {
            console.error(error)
            return Response.json({ error: error.message }, { status: 500 })
        }
    } else {
        try {
            let data
            switch (event) {
                case Event.GetBlock:
                    data = await socketManager.getBlock(chain)
                    break
                case Event.GetFee:
                    const network = url.searchParams.get('network') || ''
                    const response = url.searchParams.get('response') === 'true'
                    if (!chain) {
                        return Response.json({ error: 'Missing chain param' }, { status: 400 })
                    }
                    data = await socketManager.getFee(chain, network, response)
                    break
                case Event.GetConfig:
                    if (!chain) {
                        return Response.json({ error: 'Missing chain param' }, { status: 400 })
                    }
                    data = await socketManager.getConfig(chain)
                    break
                case Event.RelayMessage:
                    const { chain: nid, txHash } = await req.json()
                    data = await socketManager.relayMessage(nid, txHash)
                    break
                case Event.PruneDB:
                    data = await socketManager.pruneDB()
                    break
                case Event.ClaimFee:
                    if (!chain) {
                        return Response.json({ error: 'Missing chain param' }, { status: 400 })
                    }
                    data = await socketManager.claimFee(chain)
                    break
                case Event.ListChainInfo:
                    const { chains: nids } = await req.json()
                    data = await socketManager.listChains(nids)
                    break
                case Event.GetChainBalance:
                    const chains = await req.json()
                    data = await socketManager.getChainBalance(chains)
                    break
                case Event.GetBlockEvents:
                    const { txHash: eventBlockHash } = await req.json()
                    data = await socketManager.getBlockEvents(eventBlockHash)
                    break
                case Event.Metrics:
                    data = await fetchMetrics()
                    break
                case Event.RelayerInfo:
                    data = await socketManager.relayInfo()
                    break
                case Event.GetMessageList:
                    const limit = url.searchParams.has('limit') ? parseInt(url.searchParams.get('limit') as string) : 10
                    data = await socketManager.getMessageList(chain, limit)
                    break
                case Event.MessageRemove:
                    const deleteSn = url.searchParams.get('sn')
                    if (!chain || !deleteSn) {
                        return Response.json({ error: 'Missing chain or sn param' }, { status: 400 })
                    }
                    data = await socketManager.removeMessage(chain, deleteSn)
                    break
                case Event.RelayerLogs:
                    const level = url.searchParams.get('level') || 'all'
                    const tail = url.searchParams.get('tail') || '100'
                    const logLimit = parseInt(tail)
                    const container = url.searchParams.get('container') || 'relayer'
                    const since = url.searchParams.has('since') ? parseInt(url.searchParams.get('since') as string) : 0
                    const until = url.searchParams.has('until') ? parseInt(url.searchParams.get('until') as string) : 0
                    data = await getLogs(container, { level, tail: logLimit, since, until })
                    break
                default:
                    return Response.json({ error: 'Invalid event' }, { status: 400 })
            }
            return Response.json(data)
        } catch (error: any) {
            return Response.json({ error: error.message }, { status: 500 })
        }
    }
}

export { handler as DELETE, handler as GET, handler as POST, handler as PUT }
