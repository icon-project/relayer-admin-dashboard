import EventEmitter from 'events';
import { createConnection, Socket } from 'net';

interface Packet {
  id: string;
  event: string;
  data: any;
}

interface SocketResponse<T> {
  status: boolean;
  data?: T;
  message?: string;
}

type BlockResponse = {
  chain: string;
  height: number;
};

type MessageListResponse = {
  messages: any[];
  total: number;
};

type RemoveMessageResponse = {
  sn: number;
  chain: string;
  dst: string;
  messageHeight: number;
  eventType: string;
};

type RelayMessageResponse = {
  message: any;
};

type PruneDBResponse = {
  status: string;
};

type RevertMessageResponse = {
  sn: number;
};

type GetFeeResponse = {
  chain: string;
  fee: number;
};

type SetFeeResponse = {
  status: string;
};

type ClaimFeeResponse = {
  status: string;
};

type ChainHeightResponse = {
  chain: string;
  height: number;
};

type ProcessedBlockResponse = {
  chain: string;
  height: number;
};

type RelayRangeMessageResponse = {
  chain: string;
  messages: any[];
};

type BlockRangeResponse = {
  chain: string;
  msgs: any[];
};

type ConfigResponse = {
  config: any;
};

type ChainsListResponse = {
  chains: string[];
};

class SocketManager extends EventEmitter {
  private socket: Socket | null = null;
  private readonly socketPath: string = process.env.NEXT_RELAYER_SOCKET_PATH || '/tmp/relayer.sock';
  private retryCount: number = 0;
  private maxRetries: number = 5;
  private retryDelay: number = 3000;

  constructor() {
    super();
    this.connect();
  }

  private connect(): void {
    this.socket = createConnection(this.socketPath, () => {
      console.log('Connected to UNIX domain socket');
      this.retryCount = 0; // Reset retry count on successful connection
    });

    this.socket.on('data', (data) => {
      const packet: Packet = JSON.parse(data.toString());
      this.emit(packet.event, packet);
    });

    this.socket.on('error', (err) => {
      console.error('Socket error:', err);
      this.retryConnection();
    });

    this.socket.on('close', () => {
      console.log('Socket closed');
      this.retryConnection();
    });
  }

  private retryConnection(): void {
    if (this.retryCount < this.maxRetries) {
      setTimeout(() => {
        this.retryCount++;
        this.connect();
      }, this.retryDelay);
    } else {
      console.error('Max retries reached. Could not connect to socket.');
    }
  }

  private sendRequest<T>(event: string, data: any): Promise<SocketResponse<T>> {
    return new Promise((resolve, reject) => {
      const id = this.generateId();
      const packet: Packet = { id, event, data };

      const onResponse = (response: Packet) => {
        if (response.id === id) {
          this.off(event, onResponse);
          if (response.data.status) {
            resolve(response.data);
          } else {
            reject(new Error(response.data.message));
          }
        }
      };

      this.on(event, onResponse);
      this.socket?.write(JSON.stringify(packet));
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  // Example method for EventGetBlock
  public async getBlock(chain: string, all: boolean): Promise<SocketResponse<BlockResponse>> {
    const data = { chain, all };
    return this.sendRequest<BlockResponse>('EventGetBlock', data);
  }

  public async getMessageList(chain: string, pagination: any): Promise<SocketResponse<MessageListResponse>> {
    const data = { chain, pagination };
    return this.sendRequest<MessageListResponse>('EventGetMessageList', data);
  }

  public async removeMessage(chain: string, sn: number): Promise<SocketResponse<RemoveMessageResponse>> {
    const data = { chain, sn };
    return this.sendRequest<RemoveMessageResponse>('EventMessageRemove', data);
  }

  public async relayMessage(chain: string, sn: number, height: number): Promise<SocketResponse<RelayMessageResponse>> {
    const data = { chain, sn, height };
    return this.sendRequest<RelayMessageResponse>('EventRelayMessage', data);
  }

  public async pruneDB(): Promise<SocketResponse<PruneDBResponse>> {
    return this.sendRequest<PruneDBResponse>('EventPruneDB', {});
  }

  public async revertMessage(chain: string, sn: number): Promise<SocketResponse<RevertMessageResponse>> {
    const data = { chain, sn };
    return this.sendRequest<RevertMessageResponse>('EventRevertMessage', data);
  }

  public async getFee(chain: string, network: string, response: boolean): Promise<SocketResponse<GetFeeResponse>> {
    const data = { chain, network, response };
    return this.sendRequest<GetFeeResponse>('EventGetFee', data);
  }

  public async setFee(chain: string, network: string, msgFee: number, resFee: number): Promise<SocketResponse<SetFeeResponse>> {
    const data = { chain, network, msgFee, resFee };
    return this.sendRequest<SetFeeResponse>('EventSetFee', data);
  }

  public async claimFee(chain: string): Promise<SocketResponse<ClaimFeeResponse>> {
    const data = { chain };
    return this.sendRequest<ClaimFeeResponse>('EventClaimFee', data);
  }

  public async getLatestHeight(chain: string): Promise<SocketResponse<ChainHeightResponse>> {
    const data = { chain };
    return this.sendRequest<ChainHeightResponse>('EventGetLatestHeight', data);
  }

  public async getLatestProcessedBlock(chain: string): Promise<SocketResponse<ProcessedBlockResponse>> {
    const data = { chain };
    return this.sendRequest<ProcessedBlockResponse>('EventGetLatestProcessedBlock', data);
  }

  public async relayRangeMessage(chain: string, fromHeight: number, toHeight: number): Promise<SocketResponse<RelayRangeMessageResponse>> {
    const data = { chain, fromHeight, toHeight };
    return this.sendRequest<RelayRangeMessageResponse>('EventRelayRangeMessage', data);
  }

  public async getBlockRange(chain: string, fromHeight: number, toHeight: number): Promise<SocketResponse<BlockRangeResponse>> {
    const data = { chain, fromHeight, toHeight };
    return this.sendRequest<BlockRangeResponse>('EventGetBlockRange', data);
  }

  public async getConfig(chain: string): Promise<SocketResponse<ConfigResponse>> {
    const data = { chain };
    return this.sendRequest<ConfigResponse>('EventGetConfig', data);
  }

  public async listChains(): Promise<SocketResponse<ChainsListResponse>> {
    return this.sendRequest<ChainsListResponse>('EventListChain', {});
  }
}

export const socketManager = new SocketManager()