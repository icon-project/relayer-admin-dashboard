import ChainList from '@/components/Page/Dashboard/ChainList'

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id
    return <ChainList relayerId={id} />
}
