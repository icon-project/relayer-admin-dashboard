'use client'

import Loading from '@/components/Loading/Loading'
import { useRelayer } from '@/hooks/relayer/use-relayer-list'
import { ChainInfoResponse } from '@/utils/socket-fetch'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'

const ChainList: React.FC = () => {
    const [chains, setChains] = useState<ChainInfoResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { currentRelayer } = useRelayer()
    const router = useRouter()

    useEffect(() => {
        const fetchChains = async () => {
            setLoading(true)
            const relayerId = currentRelayer?.id ?? ''
            try {
                const response = await fetch(`/api/relayer?event=ListChainInfo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ relayerId }),
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch chains')
                }

                const data: ChainInfoResponse[] = await response.json()
                setChains(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchChains()
    }, [currentRelayer])

    const handleShowDetails = (id: string) => {
        router.push(`/chain/${id}`)
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="10">
                    <h1>Chain List</h1>
                    {loading && <Loading />}
                    {error && <p className="text-danger">{error}</p>}
                    {!loading && !error && (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>NID</th>
                                    <th>Type</th>
                                    <th>Address</th>
                                    <th>Latest Height</th>
                                    <th>Last CheckPoint</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chains.map((chain) => (
                                    <tr key={chain.nid}>
                                        <td>{chain.name}</td>
                                        <td>{chain.nid}</td>
                                        <td>{chain.type}</td>
                                        <td>{chain.address}</td>
                                        <td>{chain.latestHeight}</td>
                                        <td>{chain.lastCheckPoint}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleShowDetails(chain.nid)}
                                            >
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default ChainList
