'use client'

import { useRelayer } from '@/hooks/use-relayer-list'
import { ChainBalanceResponse, ChainInfoResponse } from '@/utils/socket-fetch'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'

const colors = ['primary', 'success', 'danger', 'warning', 'info']

const ChainsCard: React.FC = () => {
    const [chains, setChains] = useState<ChainInfoResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { currentRelayer } = useRelayer()

    useEffect(() => {
        const fetchChains = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/relayer?event=ListChainInfo`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ relayerId: currentRelayer?.id }),
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch chains')
                }

                const data: ChainInfoResponse[] = await response.json()

                const balanceResponse = await fetch(`/api/relayer?event=GetChainBalance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data.map((chain) => ({ chain: chain.nid, address: chain.address }))),
                })

                if (!balanceResponse.ok) {
                    throw new Error('Failed to fetch chain balances')
                }

                const balances: ChainBalanceResponse[] = await balanceResponse.json()

                const chainsWithBalances = data.map((chain) => {
                    const chainBalance = balances.find((b) => b.chain === chain.nid)
                    return {
                        ...chain,
                        balance: {
                            amount: chainBalance?.balance?.amount || 0,
                            denom: chainBalance?.balance?.denom || '',
                            value: chainBalance?.value || '',
                        },
                    }
                })

                setChains(chainsWithBalances)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchChains()
    }, [currentRelayer])

    return (
        <Row>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading &&
                !error &&
                chains.map((chain, index) => (
                    <Col sm={6} lg={3} className="mb-4" key={chain.nid}>
                        <Card bg={colors[index % colors.length]} text="white">
                            <Card.Body className="pb-0 d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="fs-4 fw-semibold">
                                        <Link href={`/chain/${chain.nid}`} className="text-white text-decoration-none">
                                            {chain.name}
                                        </Link>{' '}
                                        <span className="fs-6 ms-2 fw-normal">({chain.type})</span>
                                    </div>
                                    <div>
                                        {chain.nid}
                                        <span className="fs-6 ms-2 fw-normal">
                                            ({chain.balance?.value} {chain.balance?.denom}{' '}
                                            <FontAwesomeIcon icon={faWallet} fixedWidth />)
                                        </span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
        </Row>
    )
}

export default ChainsCard
