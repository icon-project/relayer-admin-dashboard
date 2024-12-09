import RelayerDetails from '@/components/Page/Dashboard/RelayerDetails'

type Params = Promise<{ id: string }>

export default async function Page({ params }: { params: Params }) {
    const { id } = await params
    return <RelayerDetails id={id} />
}
