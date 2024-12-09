import Loading from '@/components/Loading/Loading'
import ChainsCard from '@/components/Page/Dashboard/ChainsCard'
import MessageTable from '@/components/Page/Dashboard/MessageTable'
import UtilizationChartContainer from '@/components/Page/Dashboard/UtilizationChart'
import XcallStats from '@/components/Page/Dashboard/XcallStats'
import { getDictionary } from '@/locales/dictionary'
import fetchMetrics, { SystemMetrics } from '@/utils/metrics'
import { fetchMessages } from '@/utils/xcall-fetcher'

import { Suspense } from 'react'
import { Card, CardBody, CardFooter, CardHeader, Col, ProgressBar, Row } from 'react-bootstrap'

export default async function Page() {
    const dict = await getDictionary()
    let metrics: SystemMetrics = await fetchMetrics()
    const messages = await fetchMessages({ limit: 10 })

    return (
        <Suspense fallback={<Loading />}>
            <div className="row">
                <ChainsCard />
            </div>

            <Card className="mb-4">
                <CardBody>
                    <div className="d-flex justify-content-between">
                        <div>
                            <h4 className="mb-0">{dict.dashboard.utilization.title}</h4>
                            <div className="small text-black-50 dark:text-gray-500">
                                {dict.dashboard.utilization.uptime}: {metrics?.uptime}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            height: '300px',
                            marginTop: '40px',
                        }}
                    >
                        <UtilizationChartContainer />
                    </div>
                </CardBody>
                <CardFooter>
                    <div className="row row-cols-10 row-cols-md-8 text-center">
                        <div className="col mb-sm-2 mb-0">
                            <div className="text-black-50 dark:text-gray-500">{dict.dashboard.utilization.cpu}</div>
                            <div className="fw-semibold">{metrics?.cpuUsage}%</div>
                            <ProgressBar className="progress-thin mt-2" variant="success" now={metrics?.cpuUsage} />
                        </div>
                        <div className="col mb-sm-2 mb-0">
                            <div className="text-black-50 dark:text-gray-500">{dict.dashboard.utilization.memory}</div>
                            <div className="fw-semibold">{metrics?.memory.usedMemoryPercentage}%</div>
                            <ProgressBar
                                className="progress-thin mt-2"
                                variant="info"
                                now={metrics?.memory.usedMemoryPercentage}
                            />
                        </div>
                        <div className="col mb-sm-2 mb-0">
                            <div className="text-black-50 dark:text-gray-500">{dict.dashboard.utilization.network}</div>
                            <div className="fw-semibold">N/A</div>
                            <ProgressBar className="progress-thin mt-2" variant="primary" now={0.5} />
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <Row>
                <Col md="12">
                    <Card>
                        <CardHeader>{dict.dashboard.xcall.title}</CardHeader>
                        <CardBody>
                            <XcallStats />
                            <br />
                            <MessageTable messages={messages} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Suspense>
    )
}
