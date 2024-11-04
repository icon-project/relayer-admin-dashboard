'use client'

import UserDeleteModal from '@/components/Page/Dashboard/UserDeleteModal'
import { User } from '@/utils/user'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'

interface UsersListProps {
    users: User[]
}

const UserList: React.FC<UsersListProps> = ({ users }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    const handleDelete = async () => {
        if (currentUser) {
            await fetch(`/api/user?id=${currentUser.id}`, {
                method: 'DELETE',
            })
            window.location.reload()
        }
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="8">
                    <h1>Users</h1>
                    <Button variant="primary" href="/user/add">
                        Add User
                    </Button>
                    <Table striped bordered hover className="mt-3" responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Designation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <Link href={`/user/${user.id}`}>{user.name}</Link>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.company}</td>
                                    <td>{user.designation}</td>
                                    <td>
                                        <Button variant="warning" href={`/user/${user.id}/edit`} className="mr-2">
                                            Edit
                                        </Button>{' '}
                                        <Button variant="danger" onClick={() => setCurrentUser(user)} className="ml-2">
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <UserDeleteModal user={currentUser} onDelete={handleDelete} onCancel={() => setCurrentUser(null)} />
        </Container>
    )
}

export default UserList
