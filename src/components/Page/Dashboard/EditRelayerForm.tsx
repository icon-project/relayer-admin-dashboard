'use client'

import { RelayerConfig } from '@/utils/relayer'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

interface EditRelayerFormProps {
    relayer: RelayerConfig
}

const EditRelayerForm: React.FC<EditRelayerFormProps> = ({ relayer }) => {
    const [updatedRelayer, setUpdatedRelayer] = useState<RelayerConfig>(relayer)

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault()
        const response = await fetch('/api/relayer/connection', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...updatedRelayer, id: relayer.id }),
        })
        if (response.ok) {
            window.location.href = '/relayer'
        } else {
            alert('Failed to update relayer')
        }
    }

    return (
        <Form onSubmit={handleSave}>
            <Form.Group controlId="formId">
                <Form.Label>ID</Form.Label>
                <Form.Control type="text" value={updatedRelayer.id} disabled />
            </Form.Group>
            <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    value={updatedRelayer.name}
                    onChange={(e) =>
                        setUpdatedRelayer({
                            ...updatedRelayer,
                            name: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formHost">
                <Form.Label>Host</Form.Label>
                <Form.Control
                    type="text"
                    value={updatedRelayer.host}
                    onChange={(e) =>
                        setUpdatedRelayer({
                            ...updatedRelayer,
                            host: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={updatedRelayer.auth.email}
                    onChange={(e) =>
                        setUpdatedRelayer({
                            ...updatedRelayer,
                            auth: {
                                ...updatedRelayer.auth,
                                email: e.target.value,
                            },
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    value={updatedRelayer.auth.password}
                    onChange={(e) =>
                        setUpdatedRelayer({
                            ...updatedRelayer,
                            auth: {
                                ...updatedRelayer.auth,
                                password: e.target.value,
                            },
                        })
                    }
                />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 mr-2">
                Save
            </Button>
        </Form>
    )
}

export default EditRelayerForm
