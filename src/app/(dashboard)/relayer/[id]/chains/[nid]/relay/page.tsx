import ManualRelayForm from '@/components/Page/Dashboard/ManualRelayForm'
import { Card, CardBody, CardHeader } from 'react-bootstrap'

type Params = Promise<{ id: string; nid: string }>

export default async function Page({ params }: { params: Params }) {
    const { id, nid } = await params
    return (
        <Card>
            <CardHeader className="bg-primary text-white">
                <h4>Manual Relay</h4>
            </CardHeader>
            <CardBody>
                <ManualRelayForm relayerId={id} nid={nid} />
            </CardBody>
        </Card>
    )
}
