import ManualRelayForm from "@/components/Page/Dashboard/ManualRelayForm";

export default async function Page({ params }: { params: { id: string } }) {
  const nid = params.id;
  return <ManualRelayForm chainId={nid as string} />;
};