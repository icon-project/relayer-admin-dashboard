'use client'

import useDictionary from '@/locales/dictionary-hook'
import { TotalMessagesResponse } from '@/utils/xcall-fetcher'
import { FC, useEffect, useState } from 'react'

const XcallStats: FC = () => {
    const dict = useDictionary()
    const [totalMessages, setTotalMessages] = useState<number>(0)
    const [totalPendingMessages, setTotalPendingMessages] = useState<number>(0)
    const [totalDeliveredMessages, setTotalDeliveredMessages] =
        useState<number>(0)
    const [totalExecutedMessages, setTotalExecutedMessages] =
        useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            const responsePending = await fetch(
                '/api/xcall/messages/count?status=pending'
            )
            const totalPendingMessagesResponse: TotalMessagesResponse =
                await responsePending.json()
            setTotalPendingMessages(totalPendingMessagesResponse.data.total)

            const responseDelivered = await fetch(
                '/api/xcall/messages/count?status=delivered'
            )
            const totalDeliveredMessagesResponse: TotalMessagesResponse =
                await responseDelivered.json()
            setTotalDeliveredMessages(totalDeliveredMessagesResponse.data.total)

            const responseExecuted = await fetch(
                '/api/xcall/messages/count?status=executed'
            )
            const totalExecutedMessagesResponse: TotalMessagesResponse =
                await responseExecuted.json()
            setTotalExecutedMessages(totalExecutedMessagesResponse.data.total)

            const total =
                totalPendingMessagesResponse.data.total +
                totalDeliveredMessagesResponse.data.total +
                totalExecutedMessagesResponse.data.total
            setTotalMessages(total)
        }

        fetchData()

        const intervalId = setInterval(fetchData, 30000)
        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className="row">
            <div className="col-sm-6">
                <div className="row">
                    <div className="col-6">
                        <div className="border-start border-4 border-primary px-3 mb-3">
                            <small className="text-black-50 dark:text-gray-500">
                                {dict.dashboard.xcall.stats.total}
                            </small>
                            <div className="fs-5 fw-semibold">
                                {totalMessages}
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="border-start border-4 border-danger px-3 mb-3">
                            <small className="text-black-50 dark:text-gray-500">
                                {dict.dashboard.xcall.stats.pending}
                            </small>
                            <div className="fs-5 fw-semibold">
                                {totalPendingMessages}
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="mt-0" />
            </div>

            <div className="col-sm-6">
                <div className="row">
                    <div className="col-6">
                        <div className="border-start border-4 border-warning px-3 mb-3">
                            <small className="text-black-50 dark:text-gray-500">
                                {dict.dashboard.xcall.stats.delivered}
                            </small>
                            <div className="fs-5 fw-semibold">
                                {totalDeliveredMessages}
                            </div>
                        </div>
                    </div>

                    <div className="col-6">
                        <div className="border-start border-4 border-success px-3 mb-3">
                            <small className="text-black-50 dark:text-gray-500">
                                {dict.dashboard.xcall.stats.executed}
                            </small>
                            <div className="fs-5 fw-semibold">
                                {totalExecutedMessages}
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="mt-0" />
            </div>
        </div>
    )
}

export default XcallStats
