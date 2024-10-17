import { ChainInfoResponse } from '@/utils/socket-fetch';
import React from 'react';

interface ChainDetailsProps {
  data: ChainInfoResponse;
}

const ChainDetails: React.FC<ChainDetailsProps> = ({ data }) => {
  return (
    <div>
      <h1>Chain Details</h1>
      <p>Name: {data.name}</p>
      <p>NID: {data.nid}</p>
      <p>Type: {data.type}</p>
      <p>Address: {data.address}</p>
      <p>Latest Height: {data.latestHeight}</p>
      <p>Last CheckPoint: {data.lastCheckPoint}</p>
      <div>
        <h2>Contracts</h2>
        <p>XCall: {data.contracts.xcall}</p>
        <p>Connection: {data.contracts.connection}</p>
      </div>
      {data.balance && (
        <div>
          <h2>Balance</h2>
          <p>Amount: {data.balance.amount}</p>
          <p>Denom: {data.balance.denom}</p>
        </div>
      )}
    </div>
  );
};

export default ChainDetails;