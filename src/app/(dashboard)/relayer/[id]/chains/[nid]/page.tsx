import ChainDetails from '@/components/Page/Dashboard/ChainDetails'

type Params = Promise<{ id: string; nid: string }>

export default async function Page({ params }: { params: Params }) {
    const { id, nid } = await params
    return <ChainDetails relayerId={id} nid={nid} />
}
