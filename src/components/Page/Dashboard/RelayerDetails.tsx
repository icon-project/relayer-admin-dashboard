'use client'

import { RelayInfo } from '@/utils/socket-fetch';
import moment from 'moment';
import { notFound } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Table } from 'react-bootstrap';


const fetchRelayer = async (id: string): Promise<RelayInfo> => {
  const data = await fetch(`/api/relayer?relayerId=${id}&event=RelayerInfo`).then((res) => res.json());
  if (!data) {
    return notFound();
  }
  return data;
}
interface RelayDetailsProps {
  id: string;
}

const formatDate = (timestamp: number) => {
    const timeStamp = timestamp * 1000;
    return `${moment(timeStamp).format('MM Do YYYY, h:mm:ss a')} (${moment(timeStamp).fromNow()})`;
  };

const RelayerDetails: FC<RelayDetailsProps> = ({ id }) => {
  const [chainInfo, setChainInfo] = useState<RelayInfo | null>(null);

  useEffect(() => {
    const getChainInfo = async () => {
      const data = await fetchRelayer(id);
      setChainInfo(data);
    };
    getChainInfo();
  }, [id]);

  if (!chainInfo) {
    return <div>Loading...</div>;
  }

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
                <td>{chainInfo.version}</td>
              </tr>
              <tr>
                <td>Uptime</td>
                <td>{formatDate(chainInfo.uptime)}</td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

export default RelayerDetails;