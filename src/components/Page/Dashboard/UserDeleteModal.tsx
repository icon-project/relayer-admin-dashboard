'use client'

import { User } from '@/utils/user'
import { Button, Modal } from 'react-bootstrap'

interface UserDeleteModalProps {
    user: User | null
    onDelete: () => void
    onCancel: () => void
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
    user,
    onDelete,
    onCancel,
}) => {
    return (
        <Modal show={!!user} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Delete User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete the user {user?.name}?
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

export default UserDeleteModal
