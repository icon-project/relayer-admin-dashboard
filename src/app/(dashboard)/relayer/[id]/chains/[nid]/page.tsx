import ChainDetails from '@/components/Page/Dashboard/ChainDetails'

export default async function Page({ params }: { params: { id: string; nid: string } }) {
    const { id, nid } = params
    return <ChainDetails relayerId={id} nid={nid} />
}
