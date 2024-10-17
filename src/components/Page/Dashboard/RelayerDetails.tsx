'use client'

import { RelayInfo } from '@/utils/socket-fetch';
import moment from 'moment';
import { FC } from 'react';
import { Card, CardBody, CardHeader, Table } from 'react-bootstrap';

type Props = {
  data: RelayInfo;
}

const RelayerDetails: FC<Props> = ({ data }) => {

  const formatDate = (timestamp: number) => {
    const timeStamp = timestamp * 1000;
    return `${moment(timeStamp).format('MM Do YYYY, h:mm:ss a')} (${moment(timeStamp).fromNow()})`;
  };

  return (
    <div className="flex justify-center">
      <Card className="mb-4">
        <CardHeader className="bg-primary text-white">
          Relayer Details
        </CardHeader>
        <CardBody>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Version</td>
                <td>{data.version}</td>
              </tr>
              <tr>
                <td>Uptime</td>
                <td>{formatDate(data.uptime)}</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

export default RelayerDetails;