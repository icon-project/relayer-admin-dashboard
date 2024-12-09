import EditRelayerForm from '@/components/Page/Dashboard/EditRelayerForm'
import { getRelayerById } from '@/utils/relayer'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'

type Params = Promise<{ id: string }>

export default async function Page({ params }: { params: Params }) {
    const { id } = await params
    const relayer = await getRelayerById(id)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Relayer</CardTitle>
            </CardHeader>
            <CardBody>
                <EditRelayerForm relayer={relayer} />
            </CardBody>
        </Card>
    )
}
