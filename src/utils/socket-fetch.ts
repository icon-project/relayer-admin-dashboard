import EventEmitter from 'events';
import { createConnection, Socket } from 'net';

enum Event {
  GetBlock = 'GetBlock',
  GetMessageList = 'GetMessageList',
  MessageRemove = 'MessageRemove',
  RelayMessage = 'RelayMessage',
  PruneDB = 'PruneDB',
  RevertMessage = 'RevertMessage',
  GetFee = 'GetFee',
  SetFee = 'SetFee',
  ClaimFee = 'ClaimFee',
  GetLatestHeight = 'GetLatestHeight',
  GetLatestProcessedBlock = 'GetLatestProcessedBlock',
  RelayRangeMessage = 'RelayRangeMessage',
  GetBlockRange = 'GetBlockRange',
  GetConfig = 'GetConfig',
  ListChain = 'ListChain',
}


interface Packet {
  id: string;
  event: Event;
  data?: any;
}

interface SocketResponse extends Packet {
  success: boolean;
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
  private retryDelay: number = 9000;

  constructor() {
    super();
    this.connect();
  }

  private connect(): void {
    this.socket = createConnection(this.socketPath, () => {
      console.log('Connected to UNIX domain socket');
      this.retryCount = 0;
    });

    this.socket.on('data', (data) => {
      const packet: SocketResponse = JSON.parse(data.toString());
      this.emit(packet.id, packet);
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

  // Example method for EventGetBlock
  public async getBlock(chain: string, all: boolean): Promise<BlockResponse> {
    const data = { chain, all };
    return this.sendRequest<BlockResponse>(Event.GetBlock, data);
  }

  public async getMessageList(chain: string, pagination: any): Promise<MessageListResponse> {
    const data = { chain, pagination };
    return this.sendRequest<MessageListResponse>(Event.GetMessageList, data);
  }

  public async removeMessage(chain: string, sn: number): Promise<RemoveMessageResponse> {
    const data = { chain, sn };
    return this.sendRequest<RemoveMessageResponse>(Event.MessageRemove, data);
  }

  public async relayMessage(chain: string, sn: number, height: number): Promise<RelayMessageResponse> {
    const data = { chain, sn, height };
    return this.sendRequest<RelayMessageResponse>(Event.RelayMessage, data);
  }

  public async pruneDB(): Promise<PruneDBResponse> {
    return this.sendRequest<PruneDBResponse>(Event.PruneDB);
  }

  public async revertMessage(chain: string, sn: number): Promise<RevertMessageResponse> {
    const data = { chain, sn };
    return this.sendRequest<RevertMessageResponse>(Event.RevertMessage, data);
  }

  public async getFee(chain: string, network: string, response: boolean): Promise<GetFeeResponse> {
    const data = { chain, network, response };
    return this.sendRequest<GetFeeResponse>(Event.GetFee, data);
  }

  public async setFee(chain: string, network: string, msgFee: number, resFee: number): Promise<SetFeeResponse> {
    const data = { chain, network, msgFee, resFee };
    return this.sendRequest<SetFeeResponse>(Event.SetFee, data);
  }

  public async claimFee(chain: string): Promise<ClaimFeeResponse> {
    const data = { chain };
    return this.sendRequest<ClaimFeeResponse>(Event.ClaimFee, data);
  }

  public async getLatestHeight(chain: string): Promise<ChainHeightResponse> {
    const data = { chain };
    return this.sendRequest<ChainHeightResponse>(Event.GetLatestHeight, data);
  }

  public async getLatestProcessedBlock(chain: string): Promise<ProcessedBlockResponse> {
    const data = { chain };
    return this.sendRequest<ProcessedBlockResponse>(Event.GetLatestProcessedBlock, data);
  }

  public async relayRangeMessage(chain: string, fromHeight: number, toHeight: number): Promise<RelayRangeMessageResponse> {
    const data = { chain, fromHeight, toHeight };
    return this.sendRequest<RelayRangeMessageResponse>(Event.RelayRangeMessage, data);
  }

  public async getBlockRange(chain: string, fromHeight: number, toHeight: number): Promise<BlockRangeResponse> {
    const data = { chain, fromHeight, toHeight };
    return this.sendRequest<BlockRangeResponse>(Event.GetBlockRange, data);
  }

  public async getConfig(chain: string): Promise<ConfigResponse> {
    const data = { chain };
    return this.sendRequest<ConfigResponse>(Event.GetConfig, data);
  }

  public async listChains(): Promise<ChainsListResponse> {
    return this.sendRequest<ChainsListResponse>(Event.ListChain);
  }
}

export const socketManager = new SocketManager()