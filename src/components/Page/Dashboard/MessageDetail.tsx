'use client'

import { Message } from '@/utils/xcall-fetcher';
import { FC } from 'react';
import { Card, CardBody, CardHeader } from 'react-bootstrap';

type Props = {
  data: Message
}

const MessageDetail: FC<Props> = ({ data }) => {

  return (
    <Card>
      <CardHeader>
        {data.src_network} -> {data.dest_network}
      </CardHeader>
      <CardBody>
        {data.dest_address}
      </CardBody>
    </Card>
  );
}

export default MessageDetail;