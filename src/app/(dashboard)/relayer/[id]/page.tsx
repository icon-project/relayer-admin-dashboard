import RelayerDetails from '@/components/Page/Dashboard/RelayerDetails';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return <RelayerDetails id={id} />
};