'use client'

import { useRelayer } from '@/hooks/relayer/use-relayer-list'
import { faCheck, faTowerCell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'js-cookie'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavLink } from 'react-bootstrap'

export default function HeaderRelayer() {
    const { relayers, currentRelayer, setCurrentRelayer } = useRelayer()

    const changeRelayer = (id: string) => {
        const selectedRelayer = relayers.find((relayer) => relayer.id === id) || null

        if (selectedRelayer?.id === currentRelayer?.id) {
            Cookies.remove('relayerId')
            setCurrentRelayer(null)
        } else {
            Cookies.set('relayerId', id)
            setCurrentRelayer(selectedRelayer)
        }
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
                            active={relayer.id === currentRelayer?.id}
                        >
                            {relayer.id === currentRelayer?.id && <FontAwesomeIcon icon={faCheck} />} {relayer.name}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        )
    )
}
