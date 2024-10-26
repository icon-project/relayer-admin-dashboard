'use client'

import { Button, Modal } from 'react-bootstrap'

interface Relayer {
    id: string
    name: string
    host: string
    auth: {
        email: string
        password: string
    }
}

interface RelayerDeleteModalProps {
    relayer: Relayer | null
    onDelete: () => void
    onCancel: () => void
}

const RelayerDeleteModal: React.FC<RelayerDeleteModalProps> = ({
    relayer,
    onDelete,
    onCancel,
}) => {
    return (
        <Modal show={!!relayer} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Relayer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the relayer {relayer?.name}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RelayerDeleteModal
