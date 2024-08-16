'use client'

import Loading from '@/components/Loading/Loading';
import Paginate from "@/components/Pagination/Paginate";
import Summary from '@/components/Pagination/Summary';
import useDictionary from '@/locales/dictionary-hook';
import { MessagesResponse } from '@/utils/xcall-fetcher';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { faArrowAltCircleDown, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { FC, Suspense, useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormSelect, ProgressBar } from 'react-bootstrap';




const getStatusPercentage = (status: string) => {
  switch (status) {
    case 'pending':
      return 50;
    case 'delivered':
      return 75;
    case 'executed':
      return 100;
  }
}

const getVariant = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'danger';
    case 'delivered':
      return 'info';
    case 'executed':
      return 'success';
    case 'rollbacked':
      return 'warning';
    default:
      return 'danger';
  }
}

interface PaginationSummary {
  from: number;
  to: number;
  total: number;
}

const MessageTable: FC = () => {
  const dict = useDictionary();
  const [messages, setMessages] = useState<MessagesResponse>();
  const [selectedSrcNetwork, setSelectedSrcNetwork] = useState<string>('');
  const [selectedDestNetwork, setSelectedDestNetwork] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('executed');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [summary, setSummary] = useState<PaginationSummary>({ from: 0, to: 0, total: 0});
  const [perPage, setPerPage] = useState<number>(10);


  useEffect(() => {
    const fetchData = async () => {
      const skip = (currentPage - 1) * perPage;
      const response = await fetch(`/api/xcall/messages?status=${selectedStatus}&src_network=${selectedSrcNetwork}&dest_network=${selectedDestNetwork}&skip=${skip}&limit=${perPage}`);
      const messagesResponse: MessagesResponse = await response.json();
      setMessages(messagesResponse);
      setLastPage(messagesResponse.meta.pagination.total);
      setSummary({
        from: (messagesResponse.meta.pagination.number === 1) ? 1 : messagesResponse.meta.pagination.number * messagesResponse.meta.pagination.size - messagesResponse.meta.pagination.size + 1,
        to: messagesResponse.meta.pagination.number * messagesResponse.meta.pagination.size,
        total: messagesResponse.meta.pagination.total * messagesResponse.meta.pagination.size,
      });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [selectedStatus, selectedSrcNetwork, selectedDestNetwork, currentPage, perPage]);

   const handleSrcNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSrcNetwork(event.target.value);
  };

  const handleDestNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDestNetwork(event.target.value);
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(parseInt(event.target.value));
  }

  const formatDate = (date: string) => {
    const timeStamp = parseInt(date) * 1000;
    return `${moment(timeStamp).format('MM Do YYYY, h:mm:ss a')} (${moment(timeStamp).fromNow()})`;
  };

  return (
    <Suspense fallback={<Loading />}>
    <div className="table-responsive">
      <table className="table border mb-0">
        <thead className="fw-semibold">
          <tr className="align-middle table-light dark:table-dark">
            <th className="text-center" aria-label="icon">
              <FontAwesomeIcon icon={faArrowAltCircleDown} fixedWidth />
              {dict.dashboard.listing.headers.src_chain}
              <select value={selectedSrcNetwork} onChange={handleSrcNetworkChange} className="form-select form-select-sm">
                <option value="">All</option>
                {messages && Object.keys(messages?.meta.urls.tx).map((urlKey) => (
                  <option key={urlKey} value={urlKey}>{urlKey}</option>
                ))}
              </select>
            </th>
            <th className="text-center" aria-label="icon">
              <FontAwesomeIcon icon={faArrowAltCircleRight} fixedWidth />
              {dict.dashboard.listing.headers.dest_chain}
              <select value={selectedDestNetwork} onChange={handleDestNetworkChange} className="form-select form-select-sm">
                <option value="">All</option>
                {messages && Object.keys(messages?.meta.urls.tx).map((urlKey) => (
                  <option key={urlKey} value={urlKey}>{urlKey}</option>
                ))}
              </select>
            </th>
            <th>
              {dict.dashboard.listing.headers.status}
              <select value={selectedStatus} onChange={handleStatusChange} className="form-select form-select-sm">
              <option value="executed">Executed</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
      </select>
            </th>
            <th className="text-center">{dict.dashboard.listing.headers.created}</th>
            <th aria-label="Action">Action</th>
          </tr>
        </thead>
        <tbody>
          {messages?.data.map((message) => (
            <tr className="align-middle" key={message.id}>
              <td className="text-center">
                <div className="avatar avatar-md d-inline-flex position-relative">
                  <Image
                    width={32}
                    height={32}
                    sizes="16px"
                    className="rounded-circle"
                    src={`https://xcallscan.xyz/_next/image?url=%2Fimages%2Fnetwork-${message.src_network}.png&w=32&q=75`}
                    alt={message.src_network}
                  />
                </div>
              </td>
              <td className="text-center">
                <div className="avatar avatar-md d-inline-flex position-relative">
                  <Image
                    width={32}
                    height={32}
                    sizes="16px"
                    className="rounded-circle"
                    src={`https://xcallscan.xyz/_next/image?url=%2Fimages%2Fnetwork-${message.dest_network}.png&w=32&q=50`}
                    alt={message.dest_network}
                  />
                </div>
              </td>
              <td className="text-center">
                <div className="clearfix">
                  <div className="float-start">
                    <div className="fw-semibold">{message.status}</div>
                  </div>
                </div>
                <ProgressBar className="progress-thin" variant={getVariant(message.status)} now={getStatusPercentage(message.status)} />
              </td>
              <td className="text-center">
                  <div className="fw-semibold">{formatDate(message.created_at)}</div>
              </td>
              <td>
                <Dropdown align="end">
                  <DropdownToggle
                    as="button"
                    bsPrefix="btn"
                    className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                    id={`action-user-${message.id}`}
                  >
                    <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem as={Link} href={`/message/${message.id}`}>{dict.dashboard.xcall.actions.view}</DropdownItem>
                    {message.status !== 'executed' && <DropdownItem as={Link} href={`/message/${message.id}/rollback`}>{dict.dashboard.xcall.actions.execute}</DropdownItem>}
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
      <div className="row align-items-center justify-content-center">
        <Summary from={summary.from} to={summary.to} total={summary.total} />
        <div className="col-auto ms-sm-auto mb-3">
      {dict.pagination.rows_per_page}
      :
      {' '}
      <FormSelect
      defaultValue={perPage}
      className="d-inline-block w-auto"
      aria-label="Item per page"
      onChange={handlePerPageChange}>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </FormSelect>
    </div>
        <Paginate onPageChange={handlePageChange} currentPage={currentPage === 0 ? 1 : currentPage} lastPage={lastPage} />
      </div>
    </div>
    </Suspense>
  );
};

export default MessageTable;