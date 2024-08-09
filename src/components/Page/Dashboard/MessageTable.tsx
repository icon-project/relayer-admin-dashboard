'use client'

import useDictionary from '@/locales/dictionary-hook';
import { Message, MessagesResponse } from '@/utils/xcall-fetcher';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import { faArrowAltCircleDown, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('executed');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/xcall/messages?status=${selectedFilter}`);
      const messagesResponse: MessagesResponse = await response.json();
      setMessages(messagesResponse.data);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [selectedFilter]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <div className="table-responsive">
      <table className="table border mb-0">
        <thead className="fw-semibold">
          <tr className="align-middle table-light dark:table-dark">
            <th className="text-center" aria-label="icon">
              <FontAwesomeIcon icon={faArrowAltCircleDown} fixedWidth />
              {dict.dashboard.listing.headers.src_chain}
            </th>
            <th className="text-center" aria-label="icon">
              <FontAwesomeIcon icon={faArrowAltCircleRight} fixedWidth />
              {dict.dashboard.listing.headers.dest_chain}
            </th>
            <th>
              {dict.dashboard.listing.headers.status}
              <select value={selectedFilter} onChange={handleFilterChange} className="form-select form-select-sm">
              <option value="executed">Executed</option>
        <option value="pending">Pending</option>
        <option value="delivered">Delivered</option>
      </select>
            </th>
            <th className="text-center">{dict.dashboard.listing.headers.created}</th>
            <th>{dict.dashboard.listing.headers.last_activity}</th>
            <th aria-label="Action"> Action</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr className="align-middle" key={message.id}>
              <td className="text-center">
                <div className="avatar avatar-md d-inline-flex position-relative">
                  <Image
                    fill
                    sizes="32px"
                    className="rounded-circle"
                    src={`https://xcallscan.xyz/_next/image?url=%2Fimages%2Fnetwork-${message.src_network}.png&w=32&q=75`}
                    alt={message.src_network}
                  />

                </div>
              </td>
              <td className="text-center">
                <div className="avatar avatar-md d-inline-flex position-relative">
                  <Image
                    fill
                    sizes="32px"
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
                    <DropdownItem href="#/action-1">Relay</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MessageTable;