'use client'

import Loading from '@/components/Loading/Loading'
import { ChainInfoResponse, Message, MessageListResponse } from '@/utils/socket-fetch'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'

interface MessageListProps {
    relayerId: string
}

const MessageList: React.FC<MessageListProps> = ({ relayerId }) => {
    const [chain, setChain] = useState<string>('')
    const [limit, setLimit] = useState<number>(10)
    const [messages, setMessages] = useState<Message[]>([])
    const [totalMessages, setTotalMessages] = useState<number>(0)
    const [chains, setChains] = useState<ChainInfoResponse[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/relayer?event=GetMessageList&chain=${chain}&limit=${limit}&relayerId=${relayerId}`
            )
            const data: MessageListResponse = await response.json()
            const sortedMessages = data?.message.sort(
                (a, b) => new Date(b.lastTry).getTime() - new Date(a.lastTry).getTime()
            )
            setMessages(sortedMessages)
            setTotalMessages(data.total)
        } catch (error) {
            console.error('Failed to fetch messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchChains = async () => {
        try {
            const response = await fetch('/api/relayer?event=ListChainInfo&relayerId=self', {
                method: 'POST',
                body: JSON.stringify({ chains: [] }),
            })
            const data: ChainInfoResponse[] = await response.json()
            setChains(data)
        } catch (error) {
            console.error('Failed to fetch chains:', error)
        }
    }

    const handleRemove = async (chain: string, messageId: number) => {
        try {
            await fetch(`/api/relayer?event=MessageRemove&sn=${messageId}&chain=${chain}&relayerId=${relayerId}`, {
                method: 'DELETE',
            })
            fetchMessages()
        } catch (error) {
            console.error('Failed to remove message:', error)
        }
    }

    useEffect(() => {
        fetchMessages()
        fetchChains()
    }, [chain, limit])

    return (
        <div className="flex justify-center">
            <Card className="mb-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <span>Messages</span>
                    <Row>
                        <Col>
                            <Form.Group controlId="chainSelect">
                                <Form.Control as="select" value={chain} onChange={(e) => setChain(e.target.value)}>
                                    <option value="">All Chains</option>
                                    {chains?.map((chainInfo) => (
                                        <option key={chainInfo.nid} value={chainInfo.nid}>
                                            {chainInfo.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="d-flex justify-content-center mt-3">
                            <Loading />
                        </div>
                    ) : (
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Destination</th>
                                    <th>SN</th>
                                    <th>Event Type</th>
                                    <th>Height</th>
                                    <th>Last/Next Try</th>
                                    <th>Retry Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages && messages.length > 0 ? (
                                    messages.map((message, index) => (
                                        <tr key={index}>
                                            <td>{message.src}</td>
                                            <td>{message.dst}</td>
                                            <td>{message.sn}</td>
                                            <td>{message.eventType}</td>
                                            <td>{message.messageHeight}</td>
                                            <td>
                                                {moment(message.lastTry).utc().local().format('YYYY-MM-DD HH:mm:ss')}
                                            </td>
                                            <td>{message.retry}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleRemove(message.src, message.sn)}
                                                >
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="text-center">
                                            No messages available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={4} className="text-start">
                                        Total Messages: {totalMessages}
                                    </td>
                                    <td colSpan={4} className="text-end">
                                        <Form.Group controlId="limitSelectFooter">
                                            <Form.Label>Limit</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={limit}
                                                onChange={(e) => setLimit(parseInt(e.target.value))}
                                                style={{ display: 'inline-block', width: 'auto', marginLeft: '10px' }}
                                            >
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default MessageList
