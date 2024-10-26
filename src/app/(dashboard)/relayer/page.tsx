import RelayersListPage from '@/components/Page/Dashboard/RelayerList'
import { readRelayers } from '@/utils/relayer'

interface Relayer {
    id: string
    name: string
    host: string
    auth: {
        email: string
        password: string
    }
}

export default async function Page() {
    const relayers = await readRelayers()

    return <RelayersListPage relayers={relayers} />
}
