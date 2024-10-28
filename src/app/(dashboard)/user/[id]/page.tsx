import UserEditForm from '@/components/Page/Dashboard/UserEditForm'
import { getUserById } from '@/utils/user'
import { Col, Container, Row } from 'react-bootstrap'

interface User {
    id: number
    email: string
    password: string
    company: string
    designation: string
}

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id
    const user = await getUserById(id)

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h1>Edit User</h1>
                    <UserEditForm user={user} />
                </Col>
            </Row>
        </Container>
    )
}
