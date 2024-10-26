import UserAddForm from '@/components/Page/Dashboard/UserAddForm'
import { Col, Container, Row } from 'react-bootstrap'

export default function Page() {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h1>Add User</h1>
                    <UserAddForm />
                </Col>
            </Row>
        </Container>
    )
}
