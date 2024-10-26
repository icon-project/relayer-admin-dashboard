'use client'

import { User } from '@/utils/user'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

interface UserEditFormProps {
    user: User
}

const UserEditForm: React.FC<UserEditFormProps> = ({ user }) => {
    const [updatedUser, setUpdatedUser] = useState<User>(user)

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault()
        const response = await fetch('/api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
        })
        if (response.ok) {
            window.location.href = '/user'
        } else {
            alert('Failed to update user')
        }
    }

    return (
        <Form onSubmit={handleSave}>
            <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={updatedUser.email}
                    onChange={(e) =>
                        setUpdatedUser({
                            ...updatedUser,
                            email: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={updatedUser.password}
                    onChange={(e) =>
                        setUpdatedUser({
                            ...updatedUser,
                            password: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formCompany">
                <Form.Label>Company</Form.Label>
                <Form.Control
                    type="text"
                    value={updatedUser.company}
                    onChange={(e) =>
                        setUpdatedUser({
                            ...updatedUser,
                            company: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formDesignation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                    type="text"
                    value={updatedUser.designation}
                    onChange={(e) =>
                        setUpdatedUser({
                            ...updatedUser,
                            designation: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </div>
        </Form>
    )
}

export default UserEditForm
