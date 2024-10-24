'use client'

import { ChainInfoResponse } from '@/utils/socket-fetch';
import { notFound } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Table } from 'react-bootstrap';

interface ChainDetailsProps {
  id: string;
}

const fetchChainInfo = async (id: string): Promise<ChainInfoResponse> => {
  const data = await fetch(`/api/relayer?chain=${id}&event=ListChainInfo`, {
    method: 'POST',
    body: JSON.stringify({ chains: [id] }),
  }).then((res) => res.json());
  if (!data || data.length === 0) {
    return notFound();
  }
  return data[0];
}

const ChainDetails: React.FC<ChainDetailsProps> = ({ id }) => {
  const [chainInfo, setChainInfo] = useState<ChainInfoResponse | null>(null);

  useEffect(() => {
    const getChainInfo = async () => {
      const data = await fetchChainInfo(id);
      setChainInfo(data);
    };
    getChainInfo();
  }, [id]);

  if (!chainInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <h1>Chain Details</h1>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{chainInfo.name}</td>
            </tr>
            <tr>
              <td>NID</td>
              <td>{chainInfo.nid}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{chainInfo.type}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{chainInfo.address}</td>
            </tr>
            <tr>
              <td>Latest Height</td>
              <td>{chainInfo.latestHeight}</td>
            </tr>
            <tr>
              <td>Last CheckPoint</td>
              <td>{chainInfo.lastCheckPoint}</td>
            </tr>
            <tr>
              <td>Contracts</td>
              <td>
                <div>XCall: {chainInfo.contracts.xcall}</div>
                <div>Connection: {chainInfo.contracts.connection}</div>
              </td>
            </tr>
            {chainInfo.balance && (
              <tr>
                <td>Balance</td>
                <td>
                  <div>Amount: {chainInfo.balance.amount}</div>
                  <div>Denom: {chainInfo.balance.denom}</div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default ChainDetails;