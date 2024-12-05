import LogsViewer from '@/components/Logs/LogsViewer'

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params
    return <LogsViewer relayerId={id} />
}
