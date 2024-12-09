import UserAddForm from '@/components/Page/Dashboard/UserAddForm'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'

export default function Page() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Add User</CardTitle>
                <CardBody>
                    <UserAddForm />
                </CardBody>
            </CardHeader>
        </Card>
    )
}
