import NotificationModal from '@/components/Page/Dashboard/NotificationModal'
import { Message } from '@/utils/xcall-fetcher'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

interface MessageModalProps {
    show: boolean
    handleClose: () => void
    message: Message
}

async function findMissedBy(message: Message): Promise<{ id: string; name: string; txHash: string; data: any } | null> {
    let response: Response
    let data: any

    switch (message.status) {
        case 'pending':
            response = await fetch(`/api/relayer/find-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ txHash: message.src_tx_hash }),
            })
            if (!response.ok) {
                return null
            }
            data = await response.json()
            for (const event of data) {
                if (!event.executed) {
                    data = { id: event.relayerId, name: event.name, txHash: event.txHash, data: event.data }
                    break
                }
            }
            break
        case 'delivered':
            response = await fetch(`/api/relayer/find-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ txHash: message.dest_tx_hash }),
            })
            if (!response.ok) {
                return null
            }
            data = await response.json()
            for (const event of data) {
                if (!event.executed) {
                    data = { id: event.relayerId, name: event.name, txHash: event.txHash, data: event.data }
                    break
                }
            }
    }
    return data
}

const MessageModal: React.FC<MessageModalProps> = ({ show, handleClose, message }) => {
    const [relayInfo, setRelayInfo] = React.useState<{ id: string; name: string } | null>(null)
    const [modalMessage, setModalMessage] = useState('')
    const [showNotification, setShowNotification] = useState(false)
    const handleCloseNotification = () => setShowNotification(false)
    const handleShowModal = (message: string) => {
        setModalMessage(message)
        setShowNotification(true)
    }
    const handleExecute = async (message: Message) => {
        const missedBy = await findMissedBy(message)
        if (!missedBy) {
            handleShowModal('No relayer found for this message to execute')
            return
        }
        const response = await fetch(`/api/relayer?event=RelayMessage&relayerId=${missedBy.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ txHash: missedBy.txHash, chain: missedBy.data.chainInfo.nid }),
        })
        if (!response.ok) {
            handleShowModal('Failed to execute the message')
            return
        }
        const data = await response.json()
        handleShowModal('Message executed successfully')
    }
    useEffect(() => {
        const fetchMissedBy = async () => {
            try {
                const result = await findMissedBy(message)
                setRelayInfo(result)
            } catch (error) {
                console.error('Error fetching missed by information:', error)
            }
        }

        if (show) {
            fetchMissedBy()
        }
    }, [show])
    return (
        <div>
            <Modal show={show} onHide={handleClose} role="dialog" size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Message Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>ID:</strong> {message.id}
                    </p>
                    <p>
                        <strong>Source Block Number:</strong> {message.src_block_number}
                    </p>
                    <p>
                        <strong>Source Network:</strong> {message.src_network}
                    </p>
                    <p>
                        <strong>Destination Network:</strong> {message.dest_network}
                    </p>
                    <p>
                        <strong>Status:</strong> {message.status}
                    </p>
                    <p>
                        <strong>Created At:</strong> {message.created_at}
                    </p>
                    <p>
                        <strong>Source Address:</strong> {message.src_address}
                    </p>
                    {relayInfo && (
                        <p>
                            <strong>Missed By:</strong> {relayInfo ? relayInfo.name : 'Loading...'}
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => handleExecute(message)}>
                        Execute
                    </Button>
                </Modal.Footer>
            </Modal>
            <NotificationModal
                show={showNotification}
                handleClose={handleCloseNotification}
                title="Notification"
                message={modalMessage}
            />
        </div>
    )
}

export default MessageModal
