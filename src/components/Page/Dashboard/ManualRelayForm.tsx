'use client';

import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

interface ManualRelayFormProps {
  chainId: string;
}

const ManualRelayForm: React.FC<ManualRelayFormProps> = ({ chainId }) => {
  const [txHash, setTxHash] = useState('');

  const handleRelay = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Fetch relayer ID and execution status
      const response = await fetch(`/api/relayer/find-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ txHash }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch relayer ID and execution status');
      }

      const data = await response.json();
      const missedBy = data.find((event: any) => !event.executed);

      if (!missedBy) {
        alert('No relayer found or all messages have been executed');
        return;
      }

      const { relayerId, executed } = missedBy;

      if (!executed) {
        const relayResponse = await fetch(`/api/event?event=RelayMessage&relayerId=${relayerId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ txHash, chain: chainId }),
        });

        if (!relayResponse.ok) {
          throw new Error('Failed to relay message');
        }

        alert('Message relayed successfully');
      } else {
        alert('Message has already been executed');
      }

      setTxHash('');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h1>Relay Message</h1>
          <Form onSubmit={handleRelay}>
            <Form.Group controlId="txHash">
              <Form.Label>Transaction Hash</Form.Label>
              <Form.Control
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Enter transaction hash"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit" className="px-4" disabled={!txHash}>
                Relay
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ManualRelayForm;