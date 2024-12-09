import MessageDetail from '@/components/Page/Dashboard/MessageDetail'
import { MessageByIdResponse } from '@/utils/xcall-fetcher'
import { notFound } from 'next/navigation'
import { fetchMessageById } from 'src/utils/xcall-fetcher'

const fetchMessage = async (id: number): Promise<MessageByIdResponse> => {
    const data = await fetchMessageById(id)
    if (!data) {
        return notFound()
    }
    return data
}

type Params = Promise<{ id: number; nid: string }>

export default async function Page({ params }: { params: Params }) {
    const { id } = await params
    const data = await fetchMessage(id)
    return <MessageDetail message={data} />
}
