import UserDetails from '@/components/Page/Dashboard/UserDetails'
import { getUserById } from '@/utils/user'
import { Col, Container, Row } from 'react-bootstrap'

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id
    const user = await getUserById(id)

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h1>User Details</h1>
                    <UserDetails user={user} />
                </Col>
            </Row>
        </Container>
    )
}
