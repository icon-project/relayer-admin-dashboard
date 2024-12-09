import MessageList from '@/components/Page/Dashboard/MessageList'

type Params = Promise<{ id: string }>

export default async function Page({ params }: { params: Params }) {
    const { id } = await params
    return <MessageList relayerId={id} />
}
