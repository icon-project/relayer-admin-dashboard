import EventEmitter from 'events';
import { createConnection, Socket } from 'net';
import 'server-only';

interface Packet {
  id: string;
  event: string;
  data: unknown;
}

interface SocketResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

class SocketManager extends EventEmitter {
  private socket: Socket | null = null

  private readonly socketPath: string = process.env.RELAYER_SOCKET_PATH || '/tmp/relayer.sock'

  private retryCount: number = 0

  private maxRetries: number = 5

  private retryDelay: number = 1000

  constructor() {
    super()
    this.connect()
  }

  private connect(): void {
    this.socket = createConnection(this.socketPath, () => {
      console.log('Connected to UNIX domain socket')
      this.retryCount = 0 // Reset retry count on successful connection
    })

    this.socket.on('data', (data) => {
      const packet: Packet = JSON.parse(data.toString())
      this.emit(packet.id, packet.data)
    })

    this.socket.on('error', (err) => {
      console.error('Socket error:', err)
      this.socket = null
      this.retryConnection()
    })

    this.socket.on('end', () => {
      console.log('Disconnected from UNIX domain socket')
      this.socket = null
      this.retryConnection()
    })
  }

  private retryConnection(): void {
    if (this.retryCount < this.maxRetries) {
      console.log(`Attempting to reconnect... Attempt ${this.retryCount + 1}/${this.maxRetries}`)
      setTimeout(() => {
        this.retryCount++
        this.connect()
      }, this.retryDelay)
    } else {
      console.error('Max retries reached. Failed to connect to UNIX domain socket.')
    }
  }

  // Method to wait for a response with a timeout
  private waitForResponse<T>(packetId: string, timeout: number): Promise<SocketResponse<T>> {
    return new Promise((resolve, reject) => {
      const timeoutHandle = setTimeout(() => {
        this.removeListener(packetId, () => {})
        reject(new Error('Response timeout'))
      }, timeout)

      this.once(packetId, (data: SocketResponse<T>) => {
        clearTimeout(timeoutHandle)
        resolve(data)
      })
    })
  }

  send<T>(packet: Packet, responseTimeout?: number): Promise<SocketResponse<T>> {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        try {
          this.socket.write(JSON.stringify(packet), (err) => {
            if (err) {
              reject(err)
            } else if (responseTimeout) {
              this.waitForResponse<T>(packet.id, responseTimeout)
                .then(resolve)
                .catch(reject)
            } else {
              resolve({ status: 'success' } as SocketResponse<T>)
            }
          })
        } catch (error) {
          reject(error)
        }
      } else {
        reject(new Error('Socket is not connected'))
      }
    })
  }
}

export const socketManager = new SocketManager()
