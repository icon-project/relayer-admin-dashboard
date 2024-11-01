import { FC } from 'react'
import { Button, Modal } from 'react-bootstrap'

interface NotificationModalProps {
    show: boolean
    handleClose: () => void
    title: string
    message: string
}

const NotificationModal: FC<NotificationModalProps> = ({ show, handleClose, title, message }) => {
    return (
        <Modal show={show} onHide={handleClose} role="dialog" size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default NotificationModal
