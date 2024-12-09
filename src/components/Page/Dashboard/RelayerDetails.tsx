'use client'

import { RelayInfo } from '@/utils/socket-fetch'
import moment from 'moment'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Row, Table } from 'react-bootstrap'

const fetchRelayer = async (id: string): Promise<RelayInfo> => {
    const data = await fetch(`/api/relayer?relayerId=${id}&event=RelayerInfo`).then((res) => res.json())
    if (!data) {
        return notFound()
    }
    return data
}

interface RelayDetailsProps {
    id: string
}

const formatDate = (timestamp: number) => {
    const timeStamp = timestamp * 1000
    return `${moment(timeStamp).format('MM Do YYYY, h:mm:ss a')} (${moment(timeStamp).fromNow()})`
}

const RelayerDetails: FC<RelayDetailsProps> = ({ id }) => {
    const [chainInfo, setChainInfo] = useState<RelayInfo | null>(null)

    useEffect(() => {
        const getChainInfo = async () => {
            const data = await fetchRelayer(id)
            setChainInfo(data)
        }
        getChainInfo()
    }, [id])

    if (!chainInfo) {
        return <div>Loading...</div>
    }

    return (
        <Card className="mb-4">
            <CardHeader className="bg-primary text-white d-flex justify-content-between">
                <span>Relayer Details</span>
                <Row>
                    <Col>
                        <Link href={`/relayer/${id}/chains`} passHref>
                            <Button variant="light" size="sm">
                                Chains
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <Link href={`/relayer/${id}/messages`} passHref>
                            <Button variant="light" size="sm">
                                Messages
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <Link href={`/relayer/${id}/logs`} passHref>
                            <Button variant="light" size="sm">
                                Logs
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td>Version</td>
                            <td>{chainInfo.version}</td>
                        </tr>
                        <tr>
                            <td>Uptime</td>
                            <td>{formatDate(chainInfo.uptime)}</td>
                        </tr>
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    )
}

export default RelayerDetails
