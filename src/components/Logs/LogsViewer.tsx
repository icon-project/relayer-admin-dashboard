'use client'

import Loading from '@/components/Loading/Loading'
import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'

interface LogsViewerProps {
    relayerId: string
}

const LogsViewer: React.FC<LogsViewerProps> = ({ relayerId }) => {
    const [logs, setLogs] = useState<string[]>([])
    const [tail, setTail] = useState<number>(100)
    const [level, setLevel] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [since, setSince] = useState<string>('')
    const [until, setUntil] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const logsEndRef = useRef<HTMLDivElement>(null)
    const prevLogsRef = useRef<string>('')

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const sinceTimestamp = since ? new Date(since).getTime() / 1000 : 0
            const untilTimestamp = until ? new Date(until).getTime() / 1000 : 0
            const response = await fetch(
                `/api/relayer?event=RelayerLogs&level=${level}&tail=${tail}&relayerId=${relayerId}&since=${sinceTimestamp}&until=${untilTimestamp}`
            )
            const data = await response.json()
            setLogs(data?.trim().split('\n').reverse())
            prevLogsRef.current = data
        } catch (error) {
            console.error('Failed to fetch logs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
        const interval = setInterval(fetchLogs, 5000)
        return () => clearInterval(interval)
    }, [level, tail, since, until])

    const filteredLogs = logs.filter((log) => log.toLowerCase().includes(searchTerm.toLowerCase())).join('\n')

    return (
        <Card>
            <Card.Header className="bg-primary text-white">
                <h4>Logs</h4>
                <Row>
                    <Col md={1}>
                        <Form.Group controlId="levelSelect">
                            <Form.Label>Filter</Form.Label>
                            <Form.Control
                                as="select"
                                className="sm"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="error">Errors</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
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
                {loading ? (
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
                        {filteredLogs}
                        <div ref={logsEndRef} />
                    </pre>
                )}
            </Card.Body>
        </Card>
    )
}

export default LogsViewer
