import { authOptions } from '@/app/api/auth/option'
import ImageFallback from '@/components/Image/ImageFallback'
import HeaderLogout from '@/components/Layout/Dashboard/Header/HeaderLogout'
import { getDictionary } from '@/locales/dictionary'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faGear, faListCheck,
  faPowerOff
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import {
  Badge,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
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

function getGravatarUrl(email: string, size: number = 80) {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(trimmedEmail).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

export default async function HeaderProfileNav() {
  const session = await getServerSession(authOptions)
  const dict = await getDictionary()

  return (
    <Nav>
      <Dropdown as={NavItem}>
        <DropdownToggle variant="link" bsPrefix="hide-caret" className="py-0 px-2 rounded-0" id="dropdown-profile">
          <div className="avatar position-relative">
            {session && (
              <ImageFallback
                fill
                sizes="32px"
                className="rounded-circle"
                src={getGravatarUrl(session.user.email, 30)}
                alt={session.user.name}
                fallbackSrc='/assets/img/avatar.svg'
              />
            )}
          </div>
        </DropdownToggle>
        <DropdownMenu className="pt-0">
          <DropdownHeader className="fw-bold rounded-top">{dict.profile.account.title}</DropdownHeader>
          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faListCheck}>
                {dict.profile.account.items.tasks}
                <Badge bg="danger" className="ms-2">42</Badge>
              </ItemWithIcon>
            </DropdownItem>
          </Link>

          <DropdownHeader className="fw-bold">{dict.profile.settings.title}</DropdownHeader>

          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faGear}>{dict.profile.settings.items.settings}</ItemWithIcon>
            </DropdownItem>
          </Link>

          <DropdownDivider />
          <HeaderLogout>
            <DropdownItem>
              <ItemWithIcon icon={faPowerOff}>{dict.profile.logout}</ItemWithIcon>
            </DropdownItem>
          </HeaderLogout>
        </DropdownMenu>
      </Dropdown>
    </Nav>
  )
}
