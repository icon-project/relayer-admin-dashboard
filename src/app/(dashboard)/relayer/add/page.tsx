import AddRelayerForm from '@/components/Page/Dashboard/AddRelayerForm'
import { Col, Container, Row } from 'react-bootstrap'

export default function Page() {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h1>Add Relayer</h1>
                    <AddRelayerForm />
                </Col>
            </Row>
        </Container>
    )
}
