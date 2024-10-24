import ChainDetails from '@/components/Page/Dashboard/ChainDetails';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return <ChainDetails id={id} />;
};