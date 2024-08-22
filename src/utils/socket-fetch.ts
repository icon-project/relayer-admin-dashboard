import EventEmitter from 'events';
import { createConnection, Socket } from 'net';

export enum Event {
  Metrics = 'Metrics',
  GetBlock = 'GetBlock',
  GetMessageList = 'GetMessageList',
  MessageRemove = 'MessageRemove',
  RelayMessage = 'RelayMessage',
  PruneDB = 'PruneDB',
  GetFee = 'GetFee',
  ClaimFee = 'ClaimFee',
  GetLatestHeight = 'GetLatestHeight',
  GetBlockRange = 'GetBlockRange',
  GetConfig = 'GetConfig',
  ListChainInfo = 'ListChainInfo',
  GetChainBalance = 'GetChainBalance',

  GetBlockEvents = 'GetBlockEvents'
}


interface Packet {
  id: string;
  event: Event;
  data?: any;
}

export interface SocketResponse extends Packet {
  success: boolean;
  message?: string;
}

export interface BlockResponse {
  chain: string;
  height: number;
};

interface Message {
  src: string;
  dst: string;
  retry: number;
  sn: number;
  data: any;
  eventType: string;
  reqID?: number;
  messageHeight: number;
}

export interface MessageListResponse {
  message: Message[];
  total: number;
};

export interface RelayMessage {
  chain: string;
  fromHeight: number;
  toHeight?: number;
}

export interface RelayMessageResponse {
  sn: number;
  src: string;
  dst: string;
  eventType?: string;
  height: number;
  reqId?: string;
};

export interface PruneDBResponse {
  status: string;
};

export interface RevertMessageResponse {
  sn: number;
};

export interface GetFee {
  chain: string;
  network: string;
  response: boolean;
}

export interface GetFeeResponse {
  chain: string;
  fee: number;
};

export interface SetFeeResponse {
  status: string;
};

export interface ClaimFeeResponse {
  status: string;
};

export interface ChainHeightResponse {
  chain: string;
  height: number;
};

export interface GetBalance {
  chain: string;
  address: string;
}

export interface MessageReceived {
  chain: string;
  sn: number;
}

export interface ConfigResponse {
  config: any;
};

export interface ChainInfoResponse {
  name: string;
  nid: string;
  type: string;
  address: string;
  lastHeight: number;
  lastCheckPoint: number
  contracts: {
    xcall?: string;
    connection?: string;
  }
  balance?: {
    amount: number;
    denom: string;
  };
};

export interface ChainBalanceResponse {
  chain: string;
  address: string;
  balance: {
    amount: number;
    denom: string;
  };
};

export interface RequestBalance {
  chain: string;
  address: string;
}

export interface BlockEvents {
  chain: string;
  address: string;
  event: string[];
  height: number;
}

class SocketManager extends EventEmitter {
  private socket: Socket | null = null;
  private readonly socketPath: string = process.env.NEXT_RELAYER_SOCKET_PATH || '/tmp/relayer.sock';
  private retryCount: number = 0;
  private maxRetries: number = 5;
  private baseRetryDelay: number = 3000;

  constructor() {
    super();
    this.connect();
  }

  private connect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.destroy();
    }
    this.socket = createConnection(this.socketPath, () => {
      console.log('Connected to UNIX domain socket');
      this.retryCount = 0;
    });
    this.socket.on('data' , (data) => {
      try {
        const response: SocketResponse = JSON.parse(data.toString());
        this.emit(response.id, response);
      } catch (error) {
        console.error('Failed to parse socket response:', error);
      }
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
    if (this.maxRetries === 0 || this.retryCount < this.maxRetries) {
      const backoffDelay = Math.pow(2, this.retryCount) * this.baseRetryDelay;
      setTimeout(() => {
        this.retryCount++;
        this.connect();
      }, backoffDelay);
    } else {
      console.error('Max retries reached. Could not connect to socket.');
    }
  }

  private sendRequest<T>(event: Event, data?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = this.generateId();
      const packet: Packet = { id, event, data };

      const onResponse = (response: SocketResponse) => {
        if (response.id === id) {
          this.off(id, onResponse);
          if (response.success) {
            resolve(response?.data);
          } else {
            reject(new Error(response.message));
          }
        }
      };

      this.on(id, onResponse);
      this.socket?.write(JSON.stringify(packet));
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  public async getBlock(chain: string, all: boolean): Promise<BlockResponse> {
    const data = { chain, all };
    return this.sendRequest<BlockResponse>(Event.GetBlock, data);
  }

  public async getMessageList(chain: string, limit: number): Promise<MessageListResponse> {
    const data = { chain, limit };
    return this.sendRequest<MessageListResponse>(Event.GetMessageList, data);
  }

  public async relayMessage(chain: string, fromHeight: number, toHeight?: number): Promise<RelayMessageResponse> {
    const data: RelayMessage = { chain, fromHeight, toHeight };
    return this.sendRequest<RelayMessageResponse>(Event.RelayMessage, data);
  }

  public async pruneDB(): Promise<PruneDBResponse> {
    return this.sendRequest<PruneDBResponse>(Event.PruneDB);
  }

  public async getFee(chain: string, network: string, response: boolean): Promise<GetFeeResponse> {
    const data = { chain, network, response };
    return this.sendRequest<GetFeeResponse>(Event.GetFee, data);
  }

  public async claimFee(chain: string): Promise<ClaimFeeResponse> {
    const data = { chain };
    return this.sendRequest<ClaimFeeResponse>(Event.ClaimFee, data);
  }

  public async getLatestHeight(chain: string): Promise<ChainHeightResponse> {
    const data = { chain };
    return this.sendRequest<ChainHeightResponse>(Event.GetLatestHeight, data);
  }

  public async getConfig(chain: string): Promise<ConfigResponse> {
    const data = { chain };
    return this.sendRequest<ConfigResponse>(Event.GetConfig, data);
  }

  public async listChains(chains?: string[]): Promise<ChainInfoResponse[]> {
    return this.sendRequest<ChainInfoResponse[]>(Event.ListChainInfo, chains);
  }

  public async getChainBalance(chains: RequestBalance[]): Promise<ChainBalanceResponse[]> {
    return this.sendRequest<ChainBalanceResponse[]>(Event.GetChainBalance, chains);
  }

  public async getBlockEvents(chain: string, height: number): Promise<BlockEvents> {
    const data = { chain, height}
    return this.sendRequest<BlockEvents>(Event.GetBlockEvents, data);
  }

}

export const socketManager = new SocketManager()