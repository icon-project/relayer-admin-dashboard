import AddRelayerForm from '@/components/Page/Dashboard/AddRelayerForm'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'

export default function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Relayer</CardTitle>
            </CardHeader>
            <CardBody>
                <AddRelayerForm />
            </CardBody>
        </Card>
    )
}
