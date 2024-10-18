import ChainDetails from '@/components/Page/Dashboard/ChainDetails';
import { ChainInfoResponse } from '@/utils/socket-fetch';
import { notFound } from 'next/navigation';

const fetchChainInfo = async (id: string): Promise<ChainInfoResponse[]> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const data = await fetch(`${BASE_URL}/relayer?chain=${id}&event=ListChainInfo`, {
    method: 'POST',
    body: JSON.stringify({ chains: [id] }),
  }).then((res) => res.json());
  if (!data || data.length === 0) {
    return notFound();
  }
  return data;
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const data = await fetchChainInfo(id);
  return <ChainDetails data={data[0]} />;
};