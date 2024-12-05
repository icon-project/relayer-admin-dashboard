import ManualRelayForm from '@/components/Page/Dashboard/ManualRelayForm'

export default async function Page({ params }: { params: { id: string; nid: string } }) {
    const { id, nid } = params
    return <ManualRelayForm relayerId={id} nid={nid} />
}
