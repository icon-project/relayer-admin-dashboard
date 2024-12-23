import BreadcrumbHeader from '@/components/Layout/Dashboard/Header/BreadcrumbHeader'
import HeaderFeaturedNav from '@/components/Layout/Dashboard/Header/HeaderFeaturedNav'
import HeaderNotificationNav from '@/components/Layout/Dashboard/Header/HeaderNotificationNav'
import HeaderProfileNav from '@/components/Layout/Dashboard/Header/HeaderProfileNav'
import HeaderSidebarToggler from '@/components/Layout/Dashboard/Header/HeaderSidebarToggler'
import Link from 'next/link'
import { Container } from 'react-bootstrap'

export default function Header() {
    return (
        <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom">
            <Container fluid className="header-navbar d-flex align-items-center px-0">
                <HeaderSidebarToggler />
                <Link href="/" className="header-brand d-md-none">
                    <svg width="80" height="46">
                        <title>Admin Dashboard</title>
                        <use xlinkHref="/assets/brand/icon-foundation.svg" />
                    </svg>
                </Link>
                <div className="header-nav d-none d-md-flex">
                    <HeaderFeaturedNav />
                </div>
                <div className="header-nav ms-auto">
                    <HeaderNotificationNav />
                </div>
                <div className="header-nav ms-2">
                    <HeaderProfileNav />
                </div>
            </Container>
            <div className="header-divider border-top my-2 mx-sm-n2" />
            <Container fluid>
                <BreadcrumbHeader />
            </Container>
        </header>
    )
}
