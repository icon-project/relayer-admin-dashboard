import RelayersListPage from '@/components/Page/Dashboard/RelayerList'
import { readRelayers } from '@/utils/relayer'

export default async function Page() {
    const relayers = await readRelayers()

    return <RelayersListPage relayers={relayers} />
}
