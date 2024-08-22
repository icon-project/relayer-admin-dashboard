import HeaderLocale from '@/components/Layout/Dashboard/Header/HeaderLocale'
import HeaderRelayer from '@/components/Layout/Dashboard/Header/HeaderRelayer'
import HeaderTheme from '@/components/Layout/Dashboard/Header/HeaderTheme'
import { getDictionary, getLocale } from '@/locales/dictionary'
import { getPreferredTheme } from '@/themes/theme'
import { getAvailableRelayers, getCurrentRelayer } from '@/utils/relayer'
import { IconDefinition, faBell } from '@fortawesome/free-regular-svg-icons'
import {
  faGaugeHigh
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import {
  Badge,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  ProgressBar
} from 'react-bootstrap'

type ItemWithIconProps = {
  icon: IconDefinition;
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
  const dict = await getDictionary()
  const relayers = await getAvailableRelayers()
  return (
    <Nav>
      <NavItem>
        <HeaderRelayer currentRelayerId={getCurrentRelayer()} relayers={relayers} />
      </NavItem>
      <NavItem className="d-none d-sm-block">
        <Dropdown>
          <DropdownToggle className="px-2 mx-1 px-sm-3 mx-sm-0" as={NavLink} bsPrefix="hide-caret" id="dropdown-notification">
            <FontAwesomeIcon icon={faBell} size="lg" />
            <Badge pill bg="danger" className="position-absolute top-0 end-0 px-1 px-sm-2">
              5
            </Badge>
          </DropdownToggle>
          <DropdownMenu className="pt-0" align="end">
            <DropdownHeader className="fw-bold rounded-top">{dict.notification.message.replace('{{total}}', '5')}</DropdownHeader>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <ItemWithIcon icon={faGaugeHigh}>
                  {dict.notification.items.server_overloaded}
                </ItemWithIcon>
              </DropdownItem>
            </Link>

            <DropdownHeader className="fw-bold">{dict.notification.server.title}</DropdownHeader>

            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small><div className="text-uppercase"><b>{dict.notification.server.items.cpu}</b></div></small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="primary"
                  now={25}
                />
                <small>
                  <div className="text-muted">
                    348
                    {dict.notification.server.processes}
                    . 1/4
                    {dict.notification.server.cores}
                    .
                  </div>
                </small>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small><div className="text-uppercase"><b>{dict.notification.server.items.memory}</b></div></small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="warning"
                  now={75}
                />
                <small>
                  <div className="text-muted">11,444GB / 16,384MB</div>
                </small>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small><div className="text-uppercase"><b>{dict.notification.server.items.ssd1}</b></div></small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="danger"
                  now={90}
                />
                <small>
                  <div className="text-muted">243GB / 256GB</div>
                </small>
              </DropdownItem>
            </Link>
          </DropdownMenu>
        </Dropdown>
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
