import RelayerDetails from '@/components/Page/Dashboard/RelayerDetails';
import { RelayInfo } from '@/utils/socket-fetch';
import { notFound } from 'next/navigation';

const fetchRelayer = async (id: string): Promise<RelayInfo> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const data = await fetch(`${BASE_URL}/relayer?relayerId=${id}&event=RelayerInfo`).then((res) => res.json());
  if (!data) {
    return notFound();
  }
  return data;
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const data = await fetchRelayer(id);
  return <RelayerDetails data={data} />
};