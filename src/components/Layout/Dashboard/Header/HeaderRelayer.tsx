'use client'

import { faTowerCell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavLink,
} from 'react-bootstrap'


interface HeaderRelayerProps {
  currentRelayerId: string
  relayers: {
    id: string
    name: string
  }[]
}

export default function HeaderRelayer({ currentRelayerId, relayers }: HeaderRelayerProps) {
  const [selectedRelayer, setRelayer] = useState(currentRelayerId)
  const router = useRouter()

  const changeRelayer = (id: string) => {
    Cookies.set('relayerId', id)
    setRelayer(id)
    router.refresh()
  }

  const deleteSelection = () => {
    Cookies.remove('relayerId')
    router.refresh()
  }

  return (
    <Dropdown>
      <DropdownToggle className="px-2 mx-1 px-sm-3 mx-sm-0" as={NavLink} bsPrefix="hide-caret" id="dropdown-locale">
        <FontAwesomeIcon icon={faTowerCell} size="lg" />
      </DropdownToggle>
      <DropdownMenu className="pt-0" align="end">
        <DropdownItem onClick={deleteSelection}>None</DropdownItem>
        {relayers.map((relayer) => (
          <DropdownItem key={relayer.id} onClick={() => changeRelayer(relayer.id)} active={relayer.id === selectedRelayer}>
            {relayer.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
