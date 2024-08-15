import MessageDetail from '@/components/Page/Dashboard/MessageDetail';
import { Message } from '@/utils/xcall-fetcher';
import { notFound } from 'next/navigation';
import { fetchMessageById } from 'src/utils/xcall-fetcher';

const fetchMessage = async (id: number): Promise<Message> => {
 const data = await fetchMessageById(id);
  if (!data) {
    return notFound();
  }
  return data.data[0];
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const data = await fetchMessage(id);
  return <MessageDetail data={data} />
};