import { io, Socket } from "socket.io-client";

export interface OnRampOrderUpdate {
  id: string;
  fiatAmount: string;
  currency: string;
  recipient: string; // wallet address
  mint: string; // token address
  chain: Chain; // enum
  amount: number;
  status: OnRampStatus;
}

export enum Chain {
  SOLANA = "solana",
  ETHEREUM = "ethereum",
  POLYGON = "polygon",
}

export enum OnRampStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface OnRampSocketEvents {
  ORDER_UPDATE: (data: OnRampOrderUpdate) => void;
  ERROR: (error: string) => void;
}

export interface OnRampSocketOptions {
  orderId: string;
  onOrderUpdate?: (data: OnRampOrderUpdate) => void;
  onError?: (error: string) => void;
}

export interface OnRampSocketInstance {
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: () => boolean;
  getSocket: () => Socket | null;
}

/**
 * Create an onramp socket instance for real-time order updates
 * @param options Configuration options for the socket
 * @returns Object with socket control methods
 */
export function createOnRampSocket(
  options: OnRampSocketOptions
): OnRampSocketInstance {
  let socket: Socket | null = null;

  const getSocketUrl = (): string => {
    const baseUrl = "https://onramp-staging.paj.cash";

    return `${baseUrl}/onramp-socket?id=${options.orderId}`;
  };

  const connect = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        socket = io(getSocketUrl(), {
          transports: ["websocket", "polling"],
          timeout: 20000,
        });

        socket.on("connect", () => {
          console.log("Connected to onramp socket");
          resolve();
        });

        socket.on("connect_error", (error: any) => {
          console.error("Socket connection error:", error);
          reject(error);
        });

        socket.on("ORDER_UPDATE", (data: OnRampOrderUpdate) => {
          console.log("Order update received:", data);
          if (options.onOrderUpdate) {
            options.onOrderUpdate(data);
          }
        });

        socket.on("ERROR", (error: string) => {
          console.error("Socket error received:", error);
          if (options.onError) {
            options.onError(error);
          }
        });

        socket.on("disconnect", (reason: any) => {
          console.log("Socket disconnected:", reason);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const disconnect = (): void => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const isConnected = (): boolean => {
    return socket?.connected || false;
  };

  const getSocket = (): Socket | null => {
    return socket;
  };

  return {
    connect,
    disconnect,
    isConnected,
    getSocket,
  };
}

export default createOnRampSocket;
