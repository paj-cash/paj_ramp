import createOnRampSocket, {
  OnRampOrderUpdate,
  OnRampSocketOptions,
  OnRampSocketInstance,
} from "../../utils/onramp-socket.js";

export interface ObserveOrderOptions {
  orderId: string;
  onOrderUpdate?: (data: OnRampOrderUpdate) => void;
  onError?: (error: string) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface ObserveOrderReturn {
  socket: OnRampSocketInstance;
  isConnected: () => boolean;
  disconnect: () => void;
  connect: () => Promise<void>;
}

/**
 * Observe an onramp order for real-time updates using Socket.IO
 * @param options Configuration options for the order observer
 * @returns Object with socket instance and control methods
 */
export function observeOrder(options: ObserveOrderOptions): ObserveOrderReturn {
  const {
    orderId,
    onOrderUpdate,
    onError,
    onConnectionStatusChange,
    onConnect,
    onDisconnect,
  } = options;

  if (!orderId) {
    throw new Error("Order ID is required for socket connection");
  }

  const socketOptions: OnRampSocketOptions = {
    orderId,
    onOrderUpdate: (data: OnRampOrderUpdate) => {
      if (onOrderUpdate) {
        onOrderUpdate(data);
      }
    },
    onError: (errorMessage: string) => {
      if (onError) {
        onError(errorMessage);
      }
    },
  };

  const socket = createOnRampSocket(socketOptions);

  // Override the socket's connect method to add our callbacks
  const originalConnect = socket.connect.bind(socket);
  const originalDisconnect = socket.disconnect.bind(socket);

  const enhancedConnect = async (): Promise<void> => {
    try {
      await originalConnect();
      if (onConnectionStatusChange) {
        onConnectionStatusChange(true);
      }
      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error.message : "Failed to connect");
      }
      throw error;
    }
  };

  const enhancedDisconnect = (): void => {
    originalDisconnect();
    if (onConnectionStatusChange) {
      onConnectionStatusChange(false);
    }
    if (onDisconnect) {
      onDisconnect();
    }
  };

  return {
    socket,
    isConnected: () => socket.isConnected(),
    disconnect: enhancedDisconnect,
    connect: enhancedConnect,
  };
}

export { OnRampOrderUpdate, OnRampSocketOptions };
export default observeOrder;
