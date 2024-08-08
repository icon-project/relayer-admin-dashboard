import { getDictionary } from '@/locales/dictionary'
import { Breadcrumb as BSBreadcrumb, BreadcrumbItem } from 'react-bootstrap'

export default async function Breadcrumb() {
  const dict = await getDictionary()
  return (
    <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
      <BreadcrumbItem active
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >{dict.breadcrumb.home}</BreadcrumbItem>
    </BSBreadcrumb>
  )
}
