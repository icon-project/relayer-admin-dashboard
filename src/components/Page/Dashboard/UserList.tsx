'use client'

import UserDeleteModal from '@/components/Page/Dashboard/UserDeleteModal'
import { User } from '@/utils/user'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, CardHeader, Col, Row, Table } from 'react-bootstrap'

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
        <Card>
            <CardHeader className="bg-primary text-white d-flex justify-content-between">
                <h3>Users</h3>
                <Row>
                    <Col>
                        <Link href="/user/add" passHref>
                            <Button variant="light">Add User</Button>
                        </Link>
                    </Col>
                </Row>
            </CardHeader>
            <Card.Body>
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
                    <tfoot>
                        <tr>
                            <td colSpan={5} className="text-end">
                                Total: {users.length}
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </Card.Body>

            <UserDeleteModal user={currentUser} onDelete={handleDelete} onCancel={() => setCurrentUser(null)} />
        </Card>
    )
}

export default UserList
