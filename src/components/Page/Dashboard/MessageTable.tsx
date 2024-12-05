'use client'

import Loading from '@/components/Loading/Loading'
import Paginate from '@/components/Pagination/Paginate'
import Summary from '@/components/Pagination/Summary'
import useDictionary from '@/locales/dictionary-hook'
import { Message, MessagesResponse } from '@/utils/xcall-fetcher'
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleDown, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { FC, Suspense, useEffect, useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormSelect, ProgressBar } from 'react-bootstrap'
import MessageModal from './MessageModal'

const getStatusPercentage = (status: string) => {
    switch (status) {
        case 'pending':
            return 50
        case 'delivered':
            return 75
        case 'executed':
            return 100
        default:
            return 0
    }
}

const getVariant = (status: string): string => {
    switch (status) {
        case 'pending':
            return 'danger'
        case 'delivered':
            return 'warning'
        case 'executed':
            return 'success'
        case 'rollbacked':
            return 'primary'
        default:
            return 'danger'
    }
}

interface PaginationSummary {
    from: number
    to: number
    total: number
}

interface State {
    messages: MessagesResponse
    selectedSrcNetwork: string
    selectedDestNetwork: string
    selectedStatus: string
    currentPage: number
    lastPage: number
    summary: PaginationSummary
    perPage: number
    showModal: boolean
    selectedMessage: Message | null
    fromDateTime?: number
    toDateTime?: number
}

interface MessageTableProps {
    messages: MessagesResponse
}

const summarize = (messages: MessagesResponse) => {
    if (!messages.meta) {
        return {
            from: 0,
            to: 0,
            total: 0,
        }
    }
    return {
        from:
            messages.meta.pagination.number === 1
                ? 1
                : messages.meta.pagination.number * messages.meta.pagination.size - messages.meta.pagination.size + 1,
        to: messages.meta.pagination.number * messages.meta.pagination.size,
        total: messages.meta.pagination.total * messages.meta.pagination.size,
    }
}

const formatDate = (date: string) => {
    const timeStamp = parseInt(date) * 1000
    return `${moment(timeStamp).format('MM Do YYYY, h:mm:ss a')} (${moment(timeStamp).fromNow()})`
}

const MessageTable: FC<MessageTableProps> = ({ messages }) => {
    const dict = useDictionary()
    const [state, setState] = useState<State>({
        messages: messages,
        selectedSrcNetwork: '',
        selectedDestNetwork: '',
        selectedStatus: '',
        currentPage: 1,
        lastPage: messages.meta.pagination.total,
        summary: summarize(messages),
        perPage: 10,
        showModal: false,
        selectedMessage: null,
        fromDateTime: 0,
        toDateTime: 0,
    })

    const handleShowModal = (message: Message) => {
        setState((prevState) => ({
            ...prevState,
            selectedMessage: message,
            showModal: true,
        }))
    }

    const handleCloseModal = () => {
        setState((prevState) => ({
            ...prevState,
            showModal: false,
            selectedMessage: null,
        }))
    }

    useEffect(() => {
        const fetchData = async () => {
            const skip = (state.currentPage - 1) * state.perPage
            const response = await fetch(
                `/api/xcall/messages?status=${state.selectedStatus}&src_network=${state.selectedSrcNetwork}&dest_network=${state.selectedDestNetwork}&skip=${skip}&limit=${state.perPage}&from_timestamp=${state.fromDateTime}&to_timestamp=${state.toDateTime}`
            )
            const messagesResponse: MessagesResponse = await response.json()
            setState((prevState) => ({
                ...prevState,
                messages: messagesResponse,
                lastPage: messagesResponse.meta?.pagination.total,
                summary: summarize(messagesResponse),
            }))
        }
        fetchData()
        const intervalId = setInterval(fetchData, 30000)
        return () => clearInterval(intervalId)
    }, [
        state.selectedStatus,
        state.selectedSrcNetwork,
        state.selectedDestNetwork,
        state.currentPage,
        state.perPage,
        state.fromDateTime,
        state.toDateTime,
    ])

    const handleChange = (key: keyof State) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        setState((prevState) => ({
            ...prevState,
            [key]: event.target.value,
        }))
    }

    const handlePageChange = (selectedItem: { selected: number }) => {
        setState((prevState) => ({
            ...prevState,
            currentPage: selectedItem.selected + 1,
        }))
    }

    const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setState((prevState) => ({
            ...prevState,
            perPage: parseInt(event.target.value),
        }))
    }

    const handleDateTimeChange =
        (key: 'fromDateTime' | 'toDateTime') => (event: React.ChangeEvent<HTMLInputElement>) => {
            const dateValue = event.target.value
            const timestamp = dateValue ? new Date(dateValue).getTime() : ''
            setState((prevState) => ({
                ...prevState,
                [key]: timestamp,
            }))
        }

    return (
        <Suspense fallback={<Loading />}>
            <div className="table-responsive">
                <table className="table border mb-0">
                    <thead className="fw-semibold">
                        <tr className="align-middle table-light dark:table-dark">
                            <th className="text-center" aria-label="icon">
                                <FontAwesomeIcon icon={faArrowAltCircleDown} fixedWidth />
                                {dict.dashboard.listing.headers.src_chain}
                                <select
                                    value={state.selectedSrcNetwork}
                                    onChange={handleChange('selectedSrcNetwork')}
                                    className="form-select form-select-sm"
                                >
                                    <option value="">All</option>
                                    {state.messages &&
                                        state.messages.meta &&
                                        Object.keys(state.messages.meta.urls.tx).map((urlKey) => (
                                            <option key={urlKey} value={urlKey}>
                                                {urlKey}
                                            </option>
                                        ))}
                                </select>
                            </th>
                            <th className="text-center" aria-label="icon">
                                <FontAwesomeIcon icon={faArrowAltCircleRight} fixedWidth />
                                {dict.dashboard.listing.headers.dest_chain}
                                <select
                                    value={state.selectedDestNetwork}
                                    onChange={handleChange('selectedDestNetwork')}
                                    className="form-select form-select-sm"
                                >
                                    <option value="">All</option>
                                    {state.messages &&
                                        state.messages.meta &&
                                        Object.keys(state.messages.meta.urls.tx).map((urlKey) => (
                                            <option key={urlKey} value={urlKey}>
                                                {urlKey}
                                            </option>
                                        ))}
                                </select>
                            </th>
                            <th>
                                {dict.dashboard.listing.headers.status}
                                <select
                                    value={state.selectedStatus}
                                    onChange={handleChange('selectedStatus')}
                                    className="form-select form-select-sm"
                                >
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="executed">Executed</option>
                                    <option value="rollbacked">Rollbacked</option>
                                </select>
                            </th>
                            <th className="text-center">
                                {dict.dashboard.listing.headers.created}
                                <div>
                                    <input
                                        type="datetime-local"
                                        className="form-control-sm"
                                        value={
                                            state.fromDateTime
                                                ? new Date(state.fromDateTime).toISOString().slice(0, 16)
                                                : ''
                                        }
                                        onChange={handleDateTimeChange('fromDateTime')}
                                    />
                                    <input
                                        type="datetime-local"
                                        className="form-control-sm"
                                        value={state.toDateTime ? new Date(state.toDateTime).toLocaleString() : ''}
                                        onChange={handleDateTimeChange('toDateTime')}
                                    />
                                </div>
                            </th>
                            <th aria-label="Action">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.messages?.data?.map((message) => (
                            <tr className="align-middle" key={message.id}>
                                <td className="text-center">
                                    <div className="avatar avatar-md d-inline-flex position-relative">
                                        <Image
                                            width={32}
                                            height={32}
                                            sizes="16px"
                                            className="rounded-circle"
                                            src={`https://xcallscan.xyz/_next/image?url=/images/network-${message.src_network}.png&w=32&q=75`}
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
                                    <ProgressBar
                                        className="progress-thin"
                                        variant={getVariant(message.status)}
                                        now={getStatusPercentage(message.status)}
                                    />
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
                                            <DropdownItem as={Link} href={`/message/${message.id}`}>
                                                {dict.dashboard.xcall.actions.view}
                                            </DropdownItem>
                                            {message.status === 'pending' && (
                                                <DropdownItem onClick={() => handleShowModal(message)}>
                                                    {dict.dashboard.xcall.actions.deliver}
                                                </DropdownItem>
                                            )}
                                            {message.status === 'delivered' && !message.response_tx_hash && (
                                                <DropdownItem onClick={() => handleShowModal(message)}>
                                                    {dict.dashboard.xcall.actions.execute}
                                                </DropdownItem>
                                            )}
                                        </DropdownMenu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="row align-items-center justify-content-center">
                    <Summary from={state.summary.from} to={state.summary.to} total={state.summary.total} />
                    <div className="col-auto ms-sm-auto mb-3">
                        {dict.pagination.rows_per_page}:{' '}
                        <FormSelect
                            defaultValue={state.perPage}
                            className="d-inline-block w-auto"
                            aria-label="Item per page"
                            onChange={handlePerPageChange}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </FormSelect>
                    </div>
                    <Paginate
                        onPageChange={handlePageChange}
                        currentPage={state.currentPage === 0 ? 1 : state.currentPage}
                        lastPage={state.lastPage}
                    />
                </div>
            </div>
            {state.selectedMessage && (
                <MessageModal show={state.showModal} handleClose={handleCloseModal} message={state.selectedMessage} />
            )}
        </Suspense>
    )
}

export default MessageTable
