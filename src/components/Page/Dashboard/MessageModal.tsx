import { Message } from '@/utils/xcall-fetcher';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface MessageModalProps {
  show: boolean;
  handleClose: () => void;
  message: Message;
}

const MessageModal: React.FC<MessageModalProps> = ({ show, handleClose, message }) => {
  return (
    <Modal show={show} onHide={handleClose} role="dialog" size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Message Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>ID:</strong> {message.id}</p>
        <p><strong>Source Block Number:</strong> {message.src_block_number}</p>
        <p><strong>Source Network:</strong> {message.src_network}</p>
        <p><strong>Destination Network:</strong> {message.dest_network}</p>
        <p><strong>Status:</strong> {message.status}</p>
        <p><strong>Created At:</strong> {message.created_at}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleClose}>
          Execute
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;