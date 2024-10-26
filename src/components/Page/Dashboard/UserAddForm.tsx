'use client'

import { User } from '@/utils/user'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const UserAddForm: React.FC = () => {
    const [user, setUser] = useState<User>({
        id: '',
        name: '',
        email: '',
        password: '',
        company: '',
        designation: '',
    })

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault()
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        if (response.ok) {
            window.location.href = '/user'
        } else {
            alert('Failed to add user')
        }
    }

    return (
        <Form onSubmit={handleSave}>
            <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={user.email}
                    className="mb-3"
                    onChange={(e) =>
                        setUser({
                            ...user,
                            email: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={user.password}
                    className="mb-3"
                    onChange={(e) =>
                        setUser({
                            ...user,
                            password: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formCompany">
                <Form.Label>Company</Form.Label>
                <Form.Control
                    type="text"
                    value={user.company}
                    className="mb-3"
                    onChange={(e) =>
                        setUser({
                            ...user,
                            company: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formDesignation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                    type="text"
                    value={user.designation}
                    onChange={(e) =>
                        setUser({
                            ...user,
                            designation: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
                <Button
                    variant="primary"
                    type="submit"
                    disabled={
                        !user.email ||
                        !user.password ||
                        !user.company ||
                        !user.designation
                    }
                >
                    Save
                </Button>
            </div>
        </Form>
    )
}

export default UserAddForm
