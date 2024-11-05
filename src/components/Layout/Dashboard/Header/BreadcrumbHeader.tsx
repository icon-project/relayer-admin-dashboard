'use client'

import Breadcrumb from '@/components/Layout/Dashboard/Breadcrumb/Breadcrumb'
import { usePathname } from 'next/navigation'

const BreadcrumbHeader = () => {
    const path = usePathname()
    return <Breadcrumb path={path} />
}

export default BreadcrumbHeader
