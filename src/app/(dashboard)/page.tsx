import Loading from '@/components/Loading/Loading'
import MessageTable from "@/components/Page/Dashboard/MessageTable"
import UtilizationChartContainer from '@/components/Page/Dashboard/UtilizationChart'
import XcallStats from "@/components/Page/Dashboard/XcallStats"
import { getDictionary } from '@/locales/dictionary'
import fetchMetrics, { SystemMetrics } from '@/utils/metrics'
import { socketManager } from '@/utils/socket-fetch'
import {
  faEllipsisVertical,
  faWallet
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ProgressBar
} from 'react-bootstrap'

export default async function Page() {
  const dict = await getDictionary()
  let metrics: SystemMetrics = await fetchMetrics()
  let chains = await socketManager.listChains()
  let balance = await socketManager.getChainBalance(chains.map((chain) => ({ chain: chain.nid, address: chain.address })))
  chains = chains.map((chain) => {
    let chainBalance = balance.find((b) => b.chain === chain.nid)
    return {
      ...chain,
      balance: {
        amount: chainBalance?.balance?.amount || 0,
        denom: chainBalance?.balance?.denom || '',
        value: chainBalance?.value || ''
      }
    }
  })

  return (
    <Suspense fallback={<Loading />}>
      <div className="row">
        { chains.map((chain) => (
        <div className="col-sm-6 col-lg-3 justify-content-center" key={chain.nid}>
          <Card bg="primary" text="white" className="mb-4">
            <CardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  {chain.name} <span className="fs-6 ms-2 fw-normal">({chain.type})</span>
                </div>
                <div>
                  {chain.nid}
                  <span className="fs-6 ms-2 fw-normal">
                    ({chain.balance?.value} {chain.balance?.denom}{' '}
                    <FontAwesomeIcon icon={faWallet} fixedWidth />
                    )
                  </span>
                </div>
              </div>
              <Dropdown align="end">
                <DropdownToggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-white shadow-none p-0"
                  id="dropdown-chart1"
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="#/action-1">{dict.dashboard.action.reset}</DropdownItem>
                  <DropdownItem as={Link} href={`/chain/${chain.nid}`}>{dict.dashboard.xcall.actions.view}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </Card>
          </div>
          ))}
      </div>

      <Card className="mb-4">
        <CardBody>
          <div className="d-flex justify-content-between">
            <div>
              <h4 className="mb-0">{dict.dashboard.utilization.title}</h4>
              <div className="small text-black-50 dark:text-gray-500">{dict.dashboard.utilization.uptime}: {metrics?.uptime}</div>
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
              <ProgressBar
                className="progress-thin mt-2"
                variant="success"
                now={metrics?.cpuUsage}
              />
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
              <ProgressBar
                className="progress-thin mt-2"
                variant="primary"
                now={0.5}
              />
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="row">
        <div className="col-md-12">
          <Card>
            <CardHeader>
              {dict.dashboard.xcall.title}
            </CardHeader>
            <CardBody>
              <XcallStats />
              <br />
              <MessageTable />
            </CardBody>
          </Card>
        </div>
      </div>
    </Suspense>
  )
}
