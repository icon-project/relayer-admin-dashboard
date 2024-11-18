'use client'

import { RelayerConfig } from '@/utils/relayer'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const AddRelayerForm: React.FC = () => {
    const [relayer, setRelayer] = useState<RelayerConfig>({
        id: '',
        name: '',
        host: '',
        auth: { email: '', password: '' },
    })

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault()
        const response = await fetch('/api/relayer/connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(relayer),
        })
        if (response.ok) {
            window.location.href = '/relayer'
        } else {
            alert('Failed to add relayer')
        }
    }

    return (
        <Form onSubmit={handleSave}>
            <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    value={relayer.name}
                    className="mb-3"
                    required
                    onChange={(e) =>
                        setRelayer({
                            ...relayer,
                            name: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formHost">
                <Form.Label>Host</Form.Label>
                <Form.Control
                    type="text"
                    value={relayer.host}
                    className="mb-3"
                    required
                    onChange={(e) =>
                        setRelayer({
                            ...relayer,
                            host: e.target.value,
                        })
                    }
                />
            </Form.Group>
            <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={relayer.auth.email}
                    className="mb-3"
                    required
                    onChange={(e) =>
                        setRelayer({
                            ...relayer,
                            auth: {
                                ...relayer.auth,
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
                    value={relayer.auth.password}
                    className="mb-3"
                    onChange={(e) =>
                        setRelayer({
                            ...relayer,
                            auth: {
                                ...relayer.auth,
                                password: e.target.value,
                            },
                        })
                    }
                />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
                <Button
                    variant="primary"
                    type="submit"
                    className="px-4 py-2 mt-3"
                    disabled={!relayer.name || !relayer.host || !relayer.auth.email || !relayer.auth.password}
                >
                    Save
                </Button>
            </div>
        </Form>
    )
}

export default AddRelayerForm
