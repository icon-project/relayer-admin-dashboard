import { MissedRelayer } from '@/utils/relayer'

export async function findMissedBy(txHash: string): Promise<MissedRelayer[] | null> {
    const response = await fetch(`/api/relayer/find-event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txHash }),
    })

    if (!response.ok) {
        return null
    }

    const data: MissedRelayer[] = await response.json()
    return data.filter((event) => !event.executed)
}

export async function executeRelay(missedRelayers: MissedRelayer[]): Promise<boolean> {
    for (const relayer of missedRelayers) {
        const response = await fetch(`/api/relayer?event=RelayMessage&relayerId=${relayer.relayerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ txHash: relayer.txHash, chain: relayer.data.chainInfo.nid }),
        })

        if (!response.ok) {
            return false
        }
    }
    return true
}
