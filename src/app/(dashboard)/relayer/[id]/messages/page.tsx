import MessageList from '@/components/Page/Dashboard/MessageList'

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id

    return <MessageList relayerId={id} />
}
