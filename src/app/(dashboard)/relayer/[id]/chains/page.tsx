import ChainList from '@/components/Page/Dashboard/ChainList'

type Params = Promise<{ id: string }>

export default async function Page({ params }: { params: Params }) {
    const { id } = await params
    return <ChainList relayerId={id} />
}
