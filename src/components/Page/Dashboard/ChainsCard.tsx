'use client'

import Loading from '@/components/Loading/Loading'
import { useRelayer } from '@/hooks/relayer/use-relayer-list'
import useDictionary from '@/locales/dictionary-hook'
import { ChainBalanceResponse, ChainInfoResponse } from '@/utils/socket-fetch'
import { faEllipsisVertical, faWallet } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Card, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const colors = ['primary', 'success', 'danger', 'warning', 'info']

const ChainsCard: React.FC = () => {
    const [chains, setChains] = useState<ChainInfoResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { currentRelayer } = useRelayer()
    const dict = useDictionary()
    const relayerId = currentRelayer?.id || 'self'

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

                const balanceResponse = await fetch(`/api/relayer?event=GetChainBalance&relayerId=${relayerId}`, {
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
            {loading && <Loading />}
            {error && <p className="text-danger">{error}</p>}
            {!loading &&
                !error &&
                chains.map((chain, index) => (
                    <Col sm={6} lg={3} className="mb-4" key={chain.nid}>
                        <Card bg={colors[index % colors.length]} text="white">
                            <Card.Body className="pb-0 d-flex justify-content-between align-items-start">
                                <div>
                                    <div className="fs-4 fw-semibold">
                                        <Link
                                            href={`/relayer/${relayerId}/chains/${chain.nid}`}
                                            className="text-white text-decoration-none"
                                        >
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
                                <Dropdown align="end">
                                    <DropdownToggle
                                        as="button"
                                        bsPrefix="btn"
                                        className="btn-link rounded-0 text-white shadow-none p-0"
                                        id="dropdown-chart1"
                                    >
                                        <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem
                                            as={Link}
                                            href={`/relayer/${relayerId}/chains/${chain.nid}/relay`}
                                        >
                                            {dict.dashboard.action.relay}
                                        </DropdownItem>
                                        <DropdownItem as={Link} href={`/relayer/${relayerId}/chains/${chain.nid}`}>
                                            {dict.dashboard.xcall.actions.view}
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
        </Row>
    )
}

export default ChainsCard
