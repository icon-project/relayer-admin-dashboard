import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { getDictionary } from '@/locales/dictionary'
import { getAvailableRelayers } from '@/utils/relayer'
import { faFileLines } from '@fortawesome/free-regular-svg-icons'
import { faGauge, faTowerCell } from '@fortawesome/free-solid-svg-icons'
import { PropsWithChildren } from 'react'

const SidebarNavTitle = (props: PropsWithChildren) => {
    const { children } = props
    return <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
}

export default async function SidebarNav() {
    const dict = await getDictionary()
    const relayers = await getAvailableRelayers()
    return (
        <ul className="list-unstyled">
            <SidebarNavItem icon={faGauge} href="/">
                {dict.sidebar.items.dashboard}
            </SidebarNavItem>
            <SidebarNavGroup toggleIcon={faTowerCell} toggleText={dict.sidebar.items.relayers}>
                <SidebarNavItem key="self" href="/relayer/self">
                    Self
                </SidebarNavItem>
                {relayers.length === 0 && (
                    <SidebarNavItem href="/relayer/add">{dict.sidebar.items.add_relayer}</SidebarNavItem>
                )}
                {relayers.map((relayer) => (
                    <SidebarNavItem key={relayer.id} href={`/relayer/${relayer.id}`}>
                        {relayer.name}
                    </SidebarNavItem>
                ))}
            </SidebarNavGroup>
            <SidebarNavTitle>{dict.sidebar.items.others}</SidebarNavTitle>
            <SidebarNavItem icon={faFileLines} href="https://github.com/icon-project/centralized-relay/wiki/">
                {dict.sidebar.items.docs}
            </SidebarNavItem>
        </ul>
    )
}
