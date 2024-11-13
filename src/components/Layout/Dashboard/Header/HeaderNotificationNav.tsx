import HeaderLocale from '@/components/Layout/Dashboard/Header/HeaderLocale'
import HeaderRelayer from '@/components/Layout/Dashboard/Header/HeaderRelayer'
import HeaderTheme from '@/components/Layout/Dashboard/Header/HeaderTheme'
import { getLocale } from '@/locales/dictionary'
import { getPreferredTheme } from '@/themes/theme'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropsWithChildren } from 'react'
import { Nav, NavItem } from 'react-bootstrap'

type ItemWithIconProps = {
    icon: IconDefinition
} & PropsWithChildren

const ItemWithIcon = (props: ItemWithIconProps) => {
    const { icon, children } = props

    return (
        <>
            <FontAwesomeIcon className="me-2" icon={icon} fixedWidth />
            {children}
        </>
    )
}

export default async function HeaderNotificationNav() {
    return (
        <Nav>
            <NavItem>
                <HeaderRelayer />
            </NavItem>
            <NavItem>
                <HeaderLocale currentLocale={getLocale()} />
            </NavItem>
            <NavItem>
                <HeaderTheme currentPreferredTheme={getPreferredTheme()} />
            </NavItem>
        </Nav>
    )
}
