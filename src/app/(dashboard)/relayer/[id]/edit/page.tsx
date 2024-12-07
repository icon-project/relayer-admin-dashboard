import EditRelayerForm from '@/components/Page/Dashboard/EditRelayerForm'
import { getRelayerById } from '@/utils/relayer'
import { Col, Container, Row } from 'react-bootstrap'

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id
    const relayer = await getRelayerById(id)

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h1>Edit Relayer</h1>
                    <EditRelayerForm relayer={relayer} />
                </Col>
            </Row>
        </Container>
    )
}
