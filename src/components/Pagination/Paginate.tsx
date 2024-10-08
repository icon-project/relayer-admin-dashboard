'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'

type Props = {
  currentPage: number;
  lastPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function Paginate(props: Props) {
  const { currentPage, lastPage, onPageChange } = props
  const [pageIndex, setPageIndex] = useState(currentPage - 1)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setPageIndex(currentPage - 1)
  }, [currentPage])

  return (
    <div className="col-auto ms-sm-auto mb-3 overflow-auto">
      <ReactPaginate
        forcePage={pageIndex}
        pageCount={lastPage}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        containerClassName="pagination mb-0"
        previousClassName="page-item"
        pageClassName="page-item"
        breakClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link"
        pageLinkClassName="page-link"
        breakLinkClassName="page-link"
        nextLinkClassName="page-link"
        previousLabel="‹"
        nextLabel="›"
        activeClassName="active"
        disabledClassName="disabled"
        onPageChange={onPageChange}
      />
    </div>
  )
}