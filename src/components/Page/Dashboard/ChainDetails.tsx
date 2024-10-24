'use client'

import { ChainInfoResponse } from '@/utils/socket-fetch';
import { notFound } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ChainDetailsProps {
  id: string;
}

const fetchChainInfo = async (id: string): Promise<ChainInfoResponse> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const data = await fetch(`${BASE_URL}/relayer?chain=${id}&event=ListChainInfo`, {
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
    <div>
      <h1>Chain Details</h1>
      <p>Name: {chainInfo.name}</p>
      <p>NID: {chainInfo.nid}</p>
      <p>Type: {chainInfo.type}</p>
      <p>Address: {chainInfo.address}</p>
      <p>Latest Height: {chainInfo.latestHeight}</p>
      <p>Last CheckPoint: {chainInfo.lastCheckPoint}</p>
      <div>
        <h2>Contracts</h2>
        <p>XCall: {chainInfo.contracts.xcall}</p>
        <p>Connection: {chainInfo.contracts.connection}</p>
      </div>
      {chainInfo.balance && (
        <div>
          <h2>Balance</h2>
          <p>Amount: {chainInfo.balance.amount}</p>
          <p>Denom: {chainInfo.balance.denom}</p>
        </div>
      )}
    </div>
  );
};

export default ChainDetails;