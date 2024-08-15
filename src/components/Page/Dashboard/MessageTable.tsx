'use client'

import Loading from '@/components/Loading/Loading';
import Paginate from "@/components/Pagination/Paginate";
import useDictionary from '@/locales/dictionary-hook';
import { MessagesResponse } from '@/utils/xcall-fetcher';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { faArrowAltCircleDown, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { FC, Suspense, useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar } from 'react-bootstrap';



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
    default:
      return 'danger';
  }
}

const MessageTable: FC = () => {
  const dict = useDictionary();
  const [messages, setMessages] = useState<MessagesResponse>();
  const [selectedSrcNetwork, setSelectedSrcNetwork] = useState<string>('');
  const [selectedDestNetwork, setSelectedDestNetwork] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('executed');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(1);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/xcall/messages?status=${selectedStatus}&src_network=${selectedSrcNetwork}&dest_network=${selectedDestNetwork}&skip=${currentPage === 0 ? 0 : (currentPage - 1) * 10}`);
      const messagesResponse: MessagesResponse = await response.json();
      setMessages(messagesResponse);
      setLastPage(messagesResponse.meta.pagination.total);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [selectedStatus, selectedSrcNetwork, selectedDestNetwork, currentPage]);

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
            <th>{dict.dashboard.listing.headers.last_activity}</th>
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
                <div className="float-start">
                  <div className="fw-semibold">{new Date(message.created_at * 1000).toLocaleString()}</div>
                </div>
              </td>
              <td>
                <div className="clearfix">
                  <div className="float-start">
                    <div className="fw-semibold">{new Date(message.created_at * 1000).toLocaleString()}</div>
                  </div>
                </div>
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
        <div className="d-flex justify-content-end">
            <div className="mr-auto p-2">
            <Paginate onPageChange={handlePageChange} currentPage={currentPage === 0 ? 1 : currentPage} lastPage={lastPage} />
            </div>
          </div>
      </table>
    </div>
    </Suspense>
  );
};

export default MessageTable;