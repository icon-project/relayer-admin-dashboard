import { Message } from '@/utils/xcall-fetcher';
import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface MessageModalProps {
  show: boolean;
  handleClose: () => void;
  message: Message;
}

async function findMissedBy(txHash: string): Promise<{ id: string; name: string, data: any } | null> {
  const response = await fetch(`/api/relayer/find-event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ txHash }),
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data;
}

const handleExecute = async (txHash: string) => {
  const missedBy = await findMissedBy(txHash);
  if (!missedBy) {
    alert('No relayer found');
    return;
  }
 const response = await fetch(`/api/event?event=RelayMessage?relayerId=${missedBy.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ txHash, chain: missedBy.data.chainInfo.nid }),
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data;
};

const MessageModal: React.FC<MessageModalProps> = ({ show, handleClose, message }) => {
  const [relayInfo, setRelayInfo] = React.useState<{ id: string; name: string } | null>(null);
  useEffect(() => {
    const fetchMissedBy = async () => {
      try {
        const result = await findMissedBy(message.src_tx_hash);
        setRelayInfo(result);
      } catch (error) {
        console.error('Error fetching missed by information:', error);
      }
    };

    if (show) {
      fetchMissedBy();
    }
  }, [show]);
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
        <p><strong>Source Address:</strong> {message.src_address}</p>
        { relayInfo && <p><strong>Missed By:</strong> {relayInfo ? relayInfo.name : 'Loading...'}</p> }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={() => handleExecute(message.src_tx_hash)}>
          Execute
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;