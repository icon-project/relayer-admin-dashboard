'use client'

import Loading from '@/components/Loading/Loading'
import React, { useEffect, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'

interface LogsViewerProps {
    relayerId: string
}

const LogsViewer: React.FC<LogsViewerProps> = ({ relayerId }) => {
    const [logs, setLogs] = useState<string[]>([])
    const [tail, setTail] = useState<number>(100)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [since, setSince] = useState<string>('')
    const [until, setUntil] = useState<string>('')
    const [initialLoad, setInitialLoad] = useState<boolean>(true)

    const fetchLogs = async () => {
        try {
            const sinceTimestamp = since ? new Date(since).getTime() / 1000 : 0
            const untilTimestamp = until ? new Date(until).getTime() / 1000 : 0
            const response = await fetch(
                `/api/relayer?event=RelayerLogs&tail=${tail}&relayerId=${relayerId}&since=${sinceTimestamp}&until=${untilTimestamp}`
            )
            const data = await response.json()
            setLogs(data?.reverse())
            if (!since && data.length > 0) {
                const lastLogTimestamp = new Date()
                setSince(`${lastLogTimestamp}`)
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error)
        } finally {
            setInitialLoad(false)
        }
    }

    useEffect(() => {
        fetchLogs()
        const interval = setInterval(fetchLogs, 5000)
        return () => clearInterval(interval)
    }, [tail, since, until])

    const filteredLogs = logs.filter((log) => log.toLowerCase().includes(searchTerm.toLowerCase())).join('\n')

    return (
        <Card>
            <Card.Header className="bg-primary text-white">
                <Card.Title>Logs</Card.Title>
                <Row>
                    <Col md={1}>
                        <Form.Group controlId="tailSelect">
                            <Form.Label>Total</Form.Label>
                            <Form.Control as="select" value={tail} onChange={(e) => setTail(parseInt(e.target.value))}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="sinceInput">
                            <Form.Label>Since</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={since}
                                onChange={(e) => setSince(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="untilInput">
                            <Form.Label>Until</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={until}
                                onChange={(e) => setUntil(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group controlId="searchInput">
                            <Form.Label>Search</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search logs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                {initialLoad ? (
                    <div className="d-flex justify-content-center mt-3">
                        <Loading />
                    </div>
                ) : (
                    <pre
                        className="pre-scrollable"
                        style={{
                            maxHeight: '500px',
                            overflowY: 'scroll',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            padding: '1px',
                        }}
                    >
                        {filteredLogs.length > 0 ? filteredLogs : 'No logs found'}
                    </pre>
                )}
            </Card.Body>
        </Card>
    )
}

export default LogsViewer
