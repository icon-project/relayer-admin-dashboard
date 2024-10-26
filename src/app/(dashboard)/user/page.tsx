import UserList from '@/components/Page/Dashboard/UserList'
import { readUsers } from '@/utils/user'

export default async function Page() {
    const users = await readUsers()

    return <UserList users={users} />
}
