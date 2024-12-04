import Loading from '@/components/Loading/Loading'
import NotificationModal from '@/components/Page/Dashboard/NotificationModal'
import { executeRelay, findMissedBy } from '@/utils/relay-action'
import { MissedRelayer } from '@/utils/relayer'
import { Message } from '@/utils/xcall-fetcher'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

interface MessageModalProps {
    show: boolean
    handleClose: () => void
    message: Message
}

const MessageModal: React.FC<MessageModalProps> = ({ show, handleClose, message }) => {
    const [relayInfo, setRelayInfo] = useState<MissedRelayer[] | null>(null)
    const [modalMessage, setModalMessage] = useState('')
    const [showNotification, setShowNotification] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCloseNotification = () => {
        setShowNotification(false)
        handleClose()
        router.push('/message')
    }
    const handleShowModal = (message: string) => {
        setModalMessage(message)
        setShowNotification(true)
    }

    const handleExecute = async (message: Message) => {
        setLoading(true)
        const hash = message.status === 'pending' ? message.src_tx_hash : message.dest_tx_hash
        if (!hash) {
            handleShowModal('Transaction hash not found')
            setLoading(false)
            return
        }
        const missedRelayers = await findMissedBy(hash)
        if (!missedRelayers || missedRelayers.length === 0) {
            handleShowModal('No relayer found for this message that can execute it')
            setLoading(false)
            return
        }

        const success = await executeRelay(missedRelayers)
        setLoading(false)
        if (success) {
            handleShowModal('Transaction is in the queue for execution')
        } else {
            handleShowModal('Failed to execute the message')
        }
    }

    useEffect(() => {
        const fetchMissedBy = async () => {
            setLoading(true)
            try {
                const hash = message.status === 'pending' ? message.src_tx_hash : message.dest_tx_hash
                if (!hash) {
                    setLoading(false)
                    return
                }
                const result = await findMissedBy(hash)
                setRelayInfo(result)
            } catch (error) {
                console.error('Error fetching missed by information:', error)
            } finally {
                setLoading(false)
            }
        }

        if (show) {
            fetchMissedBy()
        }
    }, [show, message.src_tx_hash, message.dest_tx_hash])

    return (
        <div>
            <Modal show={show} onHide={handleClose} role="dialog" size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Message Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
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
                                    <strong>Missed By:</strong> {relayInfo.map((info) => info.name).join(', ')}
                                </p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => handleExecute(message)} disabled={loading}>
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
