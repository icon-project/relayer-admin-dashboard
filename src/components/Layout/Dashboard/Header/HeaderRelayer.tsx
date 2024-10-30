'use client'

import { faCheck, faTowerCell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavLink } from 'react-bootstrap'

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
        if (id === selectedRelayer) {
            Cookies.remove('relayerId')
            setRelayer('')
        } else {
            Cookies.set('relayerId', id)
            setRelayer(id)
        }
        router.refresh()
    }

    return (
        relayers.length > 0 && (
            <Dropdown>
                <DropdownToggle
                    className="px-2 mx-1 px-sm-3 mx-sm-0"
                    as={NavLink}
                    bsPrefix="hide-caret"
                    id="dropdown-locale"
                >
                    <FontAwesomeIcon icon={faTowerCell} size="lg" />
                </DropdownToggle>
                <DropdownMenu className="pt-0" align="end">
                    {relayers.map((relayer) => (
                        <DropdownItem
                            key={relayer.id}
                            onClick={() => changeRelayer(relayer.id)}
                            active={relayer.id === selectedRelayer}
                        >
                            {relayer.id === selectedRelayer && <FontAwesomeIcon icon={faCheck} />} {relayer.name}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        )
    )
}
