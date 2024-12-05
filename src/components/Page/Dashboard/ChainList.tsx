'use client'

import Loading from '@/components/Loading/Loading'
import { ChainInfoResponse } from '@/utils/socket-fetch'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button, Card, Table } from 'react-bootstrap'

interface ChainListProps {
    relayerId: string
}

const ChainList: React.FC<ChainListProps> = ({ relayerId }) => {
    const [chains, setChains] = useState<ChainInfoResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchChains = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/relayer?event=ListChainInfo&relayerId=${relayerId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ chains: [] }),
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
    }, [])

    const handleShowDetails = (id: string) => {
        router.push(`chains/${id}`)
    }

    return (
        <div className="flex justify-center">
            <Card className="mb-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <span>Chains</span>
                </Card.Header>
                <Card.Body>
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
                            <tfoot>
                                <tr>
                                    <td colSpan={7} className="text-end">
                                        Total: {chains.length}
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

export default ChainList
