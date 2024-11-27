'use client'

import { executeRelay, findMissedBy } from '@/utils/relay-action'
import React, { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, FormControl, InputGroup, Row } from 'react-bootstrap'

interface ManualRelayFormProps {
    chainId: string
}

const ManualRelayForm: React.FC<ManualRelayFormProps> = ({ chainId }) => {
    const [txHash, setTxHash] = useState('')
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')

    const handleCloseNotification = () => setShowNotification(false)
    const handleShowNotification = (message: string) => {
        setNotificationMessage(message)
        setShowNotification(true)
    }

    const handleRelay = async (event: React.FormEvent) => {
        event.preventDefault()
        const missedRelayers = await findMissedBy(txHash)
        if (!missedRelayers || missedRelayers.length === 0) {
            handleShowNotification('No relayer found for this transaction hash that can execute it')
            return
        }

        const success = await executeRelay(missedRelayers)
        if (success) {
            handleShowNotification('Transaction executed successfully')
        } else {
            handleShowNotification('Failed to execute the transaction')
        }
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h4>Manual Relay</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleRelay}>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder="Transaction Hash"
                                        aria-label="Transaction Hash"
                                        aria-describedby="basic-addon2"
                                        value={txHash}
                                        onChange={(e) => setTxHash(e.target.value)}
                                    />
                                    <Button variant="primary" type="submit" disabled={txHash === ''}>
                                        Relay
                                    </Button>
                                </InputGroup>
                            </Form>
                            <Alert variant="info" show={showNotification} onClose={handleCloseNotification} dismissible>
                                {notificationMessage}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ManualRelayForm
