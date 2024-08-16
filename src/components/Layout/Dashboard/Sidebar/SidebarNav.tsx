import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { getDictionary } from '@/locales/dictionary'
import { loadRelayer } from '@/utils/proxy'
import {
  faFileLines
} from '@fortawesome/free-regular-svg-icons'
import {
  faGauge,
  faPuzzlePiece
} from '@fortawesome/free-solid-svg-icons'
import { PropsWithChildren } from 'react'

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props
  return <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
}

export default async function SidebarNav() {
  const dict = await getDictionary()
  const relayers = await loadRelayer()
  return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={faGauge} href="/">
        {dict.sidebar.items.dashboard}
      </SidebarNavItem>
      <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText={dict.sidebar.items.relayers}>
      {relayers.map((relayer) => (
          <SidebarNavItem key={relayer.id} href={`/relayer/${relayer.id}`}>
            {relayer.name}
          </SidebarNavItem>
      ))}
      </SidebarNavGroup>
      <SidebarNavTitle>{dict.sidebar.items.extras}</SidebarNavTitle>
      <SidebarNavItem icon={faFileLines} href="https://github.com/icon-project/centralized-relay/wiki/">{dict.sidebar.items.docs}</SidebarNavItem>
    </ul>
  )
}
