'use client'

import RelayerDeleteModal from '@/components/Page/Dashboard/RelayerDeleteModal'
import { RelayerConfig } from '@/utils/relayer'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'

interface RelayersListPageProps {
    relayers: RelayerConfig[]
}

const RelayersListPage: React.FC<RelayersListPageProps> = ({ relayers }) => {
    const [currentRelayer, setCurrentRelayer] = useState<RelayerConfig | null>(
        null
    )

    const handleDelete = async () => {
        if (currentRelayer) {
            await fetch(`/api/relayer/connection?id=${currentRelayer.id}`, {
                method: 'DELETE',
            })
            window.location.reload()
        }
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="8">
                    <h1>Relayers</h1>
                    <Button
                        variant="primary"
                        href="/relayer/add"
                        className="mb-3"
                    >
                        Add Relayer
                    </Button>
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
                                        <Link
                                            href={`/relayer/${relayer.id}`}
                                            passHref
                                        >
                                            {relayer.name}
                                        </Link>
                                    </td>
                                    <td>{relayer.host}</td>
                                    <td>{relayer.auth.email}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            href={`/relayer/${relayer.id}/edit`}
                                        >
                                            Edit
                                        </Button>{' '}
                                        <Button
                                            variant="danger"
                                            onClick={() =>
                                                setCurrentRelayer(relayer)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <RelayerDeleteModal
                relayer={currentRelayer}
                onDelete={handleDelete}
                onCancel={() => setCurrentRelayer(null)}
            />
        </Container>
    )
}

export default RelayersListPage
