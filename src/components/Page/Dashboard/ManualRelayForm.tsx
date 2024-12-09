'use client'

import Loading from '@/components/Loading/Loading'
import { executeRelay, findMissedBy } from '@/utils/relay-action'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Alert, Button, Col, Form, FormControl, InputGroup } from 'react-bootstrap'

interface ManualRelayFormProps {
    nid: string
    relayerId: string
}

const ManualRelayForm: React.FC<ManualRelayFormProps> = ({ relayerId, nid }) => {
    const [txHash, setTxHash] = useState('')
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCloseNotification = () => {
        setShowNotification(false)
        router.push(`/relayer/${relayerId}/messages`)
    }
    const handleShowNotification = (message: string) => {
        setNotificationMessage(message)
        setShowNotification(true)
    }

    const handleRelay = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true)

        const missedRelayers = await findMissedBy(txHash)
        if (!missedRelayers || missedRelayers.length === 0) {
            handleShowNotification('No relayer found for this transaction hash that can execute it')
            setLoading(false)
            return
        }

        const success = await executeRelay(missedRelayers)
        setLoading(false)
        if (success) {
            handleShowNotification('Transaction is in the queue for execution')
        } else {
            handleShowNotification('Failed to execute the transaction')
        }
    }

    return (
        <Col>
            {loading ? (
                <Loading />
            ) : (
                <Form onSubmit={handleRelay}>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Transaction Hash"
                            aria-label="Transaction Hash"
                            aria-describedby="basic-addon2"
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                        />
                        <Button variant="primary" type="submit" disabled={!txHash}>
                            Relay
                        </Button>
                    </InputGroup>
                </Form>
            )}
            <Alert variant="info" show={showNotification} onClose={handleCloseNotification} dismissible>
                {notificationMessage}
            </Alert>
        </Col>
    )
}

export default ManualRelayForm
