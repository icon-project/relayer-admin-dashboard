'use client'

import Loading from '@/components/Loading/Loading'
import { ChainInfoResponse } from '@/utils/socket-fetch'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Table } from 'react-bootstrap'

interface ChainDetailsProps {
    nid: string
    relayerId: string
}

const fetchChainInfo = async (relayerId: string, id: string): Promise<ChainInfoResponse> => {
    const data = await fetch(`/api/relayer?chain=${id}&event=ListChainInfo&relayerId=${relayerId}`, {
        method: 'POST',
        body: JSON.stringify({ chains: [id] }),
    }).then((res) => res.json())
    if (!data || data.length === 0) {
        return notFound()
    }
    return data[0]
}

const ChainDetails: React.FC<ChainDetailsProps> = ({ nid, relayerId }) => {
    const [chainInfo, setChainInfo] = useState<ChainInfoResponse | null>(null)

    useEffect(() => {
        const getChainInfo = async () => {
            const data = await fetchChainInfo(relayerId, nid)
            setChainInfo(data)
        }
        getChainInfo()
    }, [])

    if (!chainInfo) {
        return <Loading />
    }

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
                <h1>Chain Details</h1>
                <div>
                    <Link href={`${chainInfo.nid}/relay`} passHref>
                        <Button variant="primary" size="sm" className="me-2">
                            Manual Relay
                        </Button>
                    </Link>
                    <Link href={`/relayer/${relayerId}/chains`} passHref>
                        <Button variant="secondary" size="sm">
                            Chains
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardBody>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{chainInfo.name}</td>
                        </tr>
                        <tr>
                            <td>NID</td>
                            <td>{chainInfo.nid}</td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td>{chainInfo.type}</td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>{chainInfo.address}</td>
                        </tr>
                        <tr>
                            <td>Latest Height</td>
                            <td>{chainInfo.latestHeight}</td>
                        </tr>
                        <tr>
                            <td>Last CheckPoint</td>
                            <td>{chainInfo.lastCheckPoint}</td>
                        </tr>
                        <tr>
                            <td>Contracts</td>
                            <td>
                                <div>XCall: {chainInfo.contracts.xcall}</div>
                                <div>Connection: {chainInfo.contracts.connection}</div>
                            </td>
                        </tr>
                        {chainInfo.balance && (
                            <tr>
                                <td>Balance</td>
                                <td>
                                    <div>Amount: {chainInfo.balance.amount}</div>
                                    <div>Denom: {chainInfo.balance.denom}</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    )
}

export default ChainDetails
