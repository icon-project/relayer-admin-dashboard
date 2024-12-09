'use client'

import { MessageByIdResponse } from '@/utils/xcall-fetcher'
import { faClipboard } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { FC, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Table } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import MessageModal from './MessageModal'

type Props = {
    message: MessageByIdResponse
}

const MessageDetail: FC<Props> = ({ message }) => {
    const data = message.data[0]

    const [showModal, setShowModal] = useState(false)

    const handleCloseModal = () => setShowModal(false)
    const handleShowModal = () => setShowModal(true)

    const formatDate = (date: string) => {
        const timeStamp = parseInt(date) * 1000
        return `${moment(timeStamp).format('MM Do YYYY, h:mm:ss a')} (${moment(timeStamp).fromNow()})`
    }

    const truncateHash = (hash: string | null) => {
        if (!hash) return ''
        if (hash.length <= 10) return hash
        return `${hash.slice(0, 6)}...${hash.slice(-4)}`
    }

    const renderLink = (network: string, txHash: string | null, isAddr: boolean) => {
        if (!txHash) return ''
        let url = message.meta.urls.tx[network]
        if (isAddr) {
            url = url.replace('tx', 'address')
        }
        return (
            <a href={`${url}${txHash}`} target="_blank" rel="noopener noreferrer">
                {truncateHash(txHash)}
            </a>
        )
    }

    return (
        <Card className="mb-4">
            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
                <span>
                    {data.src_network} -{'>'} {data.dest_network}
                </span>
                {(data.status === 'pending' || data.status === 'delivered') && (
                    <Button variant="light" onClick={handleShowModal}>
                        Relay Message
                    </Button>
                )}
            </CardHeader>
            <CardBody>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>Response</th>
                            <th>Rollback</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Network</td>
                            <td>{data.src_network}</td>
                            <td>{data.dest_network}</td>
                            <td colSpan={2}></td>
                        </tr>
                        <tr>
                            <td>Block Number</td>
                            <td>
                                {data.src_block_number}
                                <CopyToClipboard text={data.src_block_number || ''}>
                                    <Button variant="link" className="text-decoration-none">
                                        <FontAwesomeIcon icon={faClipboard} />
                                    </Button>
                                </CopyToClipboard>
                            </td>
                            <td>
                                {data.dest_block_number || ''}
                                <CopyToClipboard text={data.dest_block_number || ''}>
                                    <Button variant="link" className="text-decoration-none">
                                        <FontAwesomeIcon icon={faClipboard} />
                                    </Button>
                                </CopyToClipboard>
                            </td>
                            <td>
                                {data.response_block_number || ''}
                                {data.response_block_number && (
                                    <CopyToClipboard text={data.response_block_number || ''}>
                                        <Button variant="link" className="text-decoration-none">
                                            <FontAwesomeIcon icon={faClipboard} />
                                        </Button>
                                    </CopyToClipboard>
                                )}
                            </td>
                            <td>
                                {data.rollback_block_number || ''}
                                {data.rollback_block_number && (
                                    <CopyToClipboard text={data.rollback_block_number || ''}>
                                        <Button variant="link" className="text-decoration-none">
                                            <FontAwesomeIcon icon={faClipboard} />
                                        </Button>
                                    </CopyToClipboard>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Block Timestamp</td>
                            <td>{formatDate(data.src_block_timestamp)}</td>
                            <td>{data.dest_block_timestamp ? formatDate(data.dest_block_timestamp) : ''}</td>
                            <td>{data.response_block_timestamp ? formatDate(data.response_block_timestamp) : ''}</td>
                            <td>{data.rollback_block_timestamp ? formatDate(data.rollback_block_timestamp) : ''}</td>
                        </tr>
                        <tr>
                            <td>TX Hash</td>
                            <td>
                                {renderLink(data.src_network, data.src_tx_hash, false)}
                                <CopyToClipboard text={data.src_tx_hash || ''}>
                                    <Button variant="link" className="text-decoration-none">
                                        <FontAwesomeIcon icon={faClipboard} />
                                    </Button>
                                </CopyToClipboard>
                            </td>
                            <td>
                                {renderLink(data.dest_network, data.dest_tx_hash, false)}
                                <CopyToClipboard text={data.dest_tx_hash || ''}>
                                    <Button variant="link" className="text-decoration-none">
                                        <FontAwesomeIcon icon={faClipboard} />
                                    </Button>
                                </CopyToClipboard>
                            </td>
                            <td>
                                {renderLink(data.dest_network, data.response_tx_hash, false)}
                                {data.response_tx_hash && (
                                    <CopyToClipboard text={data.response_tx_hash || ''}>
                                        <Button variant="link" className="text-decoration-none">
                                            <FontAwesomeIcon icon={faClipboard} />
                                        </Button>
                                    </CopyToClipboard>
                                )}
                            </td>
                            <td>
                                {renderLink(data.dest_network, data.rollback_tx_hash, false)}
                                {data.rollback_tx_hash && (
                                    <CopyToClipboard text={data.rollback_tx_hash || ''}>
                                        <Button variant="link" className="text-decoration-none">
                                            <FontAwesomeIcon icon={faClipboard} />
                                        </Button>
                                    </CopyToClipboard>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>
                                {renderLink(data.src_network, data.src_address, true)}
                                <CopyToClipboard text={data.src_address || ''}>
                                    <Button variant="link" className="text-decoration-none">
                                        <FontAwesomeIcon icon={faClipboard} />
                                    </Button>
                                </CopyToClipboard>
                            </td>
                            <td>
                                {renderLink(data.dest_network, data.dest_address, true)}
                                {data.dest_address && (
                                    <CopyToClipboard text={data.dest_address || ''}>
                                        <Button variant="link" className="text-decoration-none">
                                            <FontAwesomeIcon icon={faClipboard} />
                                        </Button>
                                    </CopyToClipboard>
                                )}
                            </td>
                            <td colSpan={5}></td>
                        </tr>
                        <tr>
                            <td>Error</td>
                            <td>{data.src_error || ''}</td>
                            <td>{data.dest_error || ''}</td>
                            <td>{data.response_error || ''}</td>
                            <td>{data.rollback_error || ''}</td>
                        </tr>
                        <tr>
                            <td>Created At</td>
                            <td colSpan={4}>{formatDate(data.created_at)}</td>
                        </tr>
                    </tbody>
                </Table>
            </CardBody>
            <MessageModal show={showModal} handleClose={handleCloseModal} message={data} />
        </Card>
    )
}

export default MessageDetail
