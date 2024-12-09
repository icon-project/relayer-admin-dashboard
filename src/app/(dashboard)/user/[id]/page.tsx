import UserDetails from '@/components/Page/Dashboard/UserDetails'
import { getUserById } from '@/utils/user'
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap'

type Params = Promise<{ id: string }>

export default async function Page({ params }: { params: Params }) {
    const { id } = await params
    const user = await getUserById(id)

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardBody>
                <UserDetails user={user} />
            </CardBody>
        </Card>
    )
}
