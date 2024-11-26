import fetchMetrics from '@/utils/metrics'
import { Event, socketManager } from '@/utils/socket-fetch'

async function handleEvent(event: Event, req: Request, args: Record<string, string>): Promise<Response> {
    let data
    switch (event) {
        case Event.GetBlock:
            data = await socketManager.getBlock(args.chain)
            break
        case Event.GetMessageList:
            if (!args.chain) {
                return Response.json({ error: 'Missing chain params' }, { status: 400 })
            }
            data = await socketManager.getMessageList(args.chain, 10)
            break
        case Event.GetFee:
            if (!args.chain) {
                return Response.json({ error: 'chain param missing' }, { status: 400 })
            } else if (!args.network) {
                return Response.json({ error: 'network param missing' }, { status: 400 })
            }
            const isResponse = args.response !== ''
            data = await socketManager.getFee(args.chain, args.network, isResponse)
            break
        case Event.GetConfig:
            if (!args.chain) {
                return Response.json({ error: 'Missing chain param' }, { status: 400 })
            }
            data = await socketManager.getConfig(args.chain)
            break
        case Event.ListChainInfo:
            const { chains: nids } = await req.json()
            data = await socketManager.listChains(nids)
            break
        case Event.GetChainBalance:
            const chains = await req.json()
            data = await socketManager.getChainBalance(chains)
            break
        case Event.RelayMessage:
            const { txHash: eventTxHash, chain: chainNID } = await req.json()
            data = await socketManager.relayMessage(chainNID, eventTxHash)
            break
        case Event.PruneDB:
            data = await socketManager.pruneDB()
            break
        case Event.ClaimFee:
            if (!args.chain) {
                return Response.json({ error: 'Missing chain params' }, { status: 400 })
            }
            data = await socketManager.claimFee(args.chain)
            break
        case Event.Metrics:
            data = await fetchMetrics()
            break
        case Event.GetBlockEvents:
            try {
                const { txHash } = await req.json()
                if (!txHash) {
                    return Response.json({ error: 'Missing params' }, { status: 400 })
                }
                data = await socketManager.getBlockEvents(txHash)
            } catch (error) {
                console.log('error', error)
            }
            break
        case Event.RelayerInfo:
            data = await socketManager.relayInfo()
            break
        default:
            return Response.json({ error: 'Invalid event' }, { status: 400 })
    }
    return Response.json(data)
}

async function handler(req: Request): Promise<Response> {
    try {
        const url = new URL(req.url)
        const event = url.searchParams.get('event') as Event
        if (!event) {
            return Response.json({ error: 'Missing event parameter' }, { status: 400 })
        }
        const args: Record<string, string> = {}
        url.searchParams.forEach((value, key) => {
            args[key] = value
        })
        return await handleEvent(event, req, args)
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 })
    }
}

export { handler as DELETE, handler as GET, handler as POST, handler as PUT }
