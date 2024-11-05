import useDictionary from '@/locales/dictionary-hook'
import { Breadcrumb as BSBreadcrumb, BreadcrumbItem } from 'react-bootstrap'

interface BreadcrumbProps {
    path: string
}

export default async function Breadcrumb({ path }: BreadcrumbProps) {
    const dict = useDictionary()
    const segments = path.split('/').filter(Boolean)

    return (
        <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
            <BreadcrumbItem linkProps={{ className: 'text-decoration-none' }} href="/">
                {dict.breadcrumb.home}
            </BreadcrumbItem>
            {segments.map((segment, index) => {
                const href = '/' + segments.slice(0, index + 1).join('/')
                const isLast = index === segments.length - 1
                return (
                    <BreadcrumbItem
                        key={href}
                        active={isLast}
                        linkProps={{ className: 'text-decoration-none' }}
                        href={href}
                    >
                        {segment}
                    </BreadcrumbItem>
                )
            })}
        </BSBreadcrumb>
    )
}
