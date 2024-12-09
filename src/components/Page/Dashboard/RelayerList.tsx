'use client'

import RelayerDeleteModal from '@/components/Page/Dashboard/RelayerDeleteModal'
import { RelayerConfig } from '@/utils/relayer'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, Col, Row, Table } from 'react-bootstrap'

interface RelayersListPageProps {
    relayers: RelayerConfig[]
}

const RelayersListPage: React.FC<RelayersListPageProps> = ({ relayers }) => {
    const [currentRelayer, setCurrentRelayer] = useState<RelayerConfig | null>(null)

    const handleDelete = async () => {
        if (currentRelayer) {
            await fetch(`/api/relayer/connection?id=${currentRelayer.id}`, {
                method: 'DELETE',
            })
            window.location.reload()
        }
    }

    return (
        <Card>
            <Card.Header className="bg-primary text-white d-flex justify-content-between">
                <h3>Relayers</h3>
                <Row className="justify-content-md-center">
                    <Col>
                        <Link href="/relayer/add" passHref>
                            <Button variant="light">Add Relayer</Button>
                        </Link>
                    </Col>
                </Row>
            </Card.Header>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Host</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {relayers.map((relayer) => (
                        <tr key={relayer.id}>
                            <td>
                                <Link href={`/relayer/${relayer.id}`} passHref>
                                    {relayer.name}
                                </Link>
                            </td>
                            <td>{relayer.host}</td>
                            <td>{relayer.auth.email}</td>
                            <td>
                                <Button variant="warning" href={`/relayer/${relayer.id}/edit`}>
                                    Edit
                                </Button>{' '}
                                <Button variant="danger" onClick={() => setCurrentRelayer(relayer)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4} className="text-end">
                            Total: {relayers.length}
                        </td>
                    </tr>
                </tfoot>
            </Table>
            <RelayerDeleteModal
                relayer={currentRelayer}
                onDelete={handleDelete}
                onCancel={() => setCurrentRelayer(null)}
            />
        </Card>
    )
}

export default RelayersListPage
