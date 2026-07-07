const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockIsConnected = jest.fn();
const mockCreateSocket = jest.fn(() => ({
  connect: mockConnect,
  disconnect: mockDisconnect,
  isConnected: mockIsConnected,
  getSocket: jest.fn(),
}));

jest.mock("../../utils/onramp-socket.js", () => ({
  __esModule: true,
  default: mockCreateSocket,
}));

import { observeOrder } from "../../lib/on_ramp/observeOrder.js";

describe("observeOrder", () => {
  afterEach(() => jest.clearAllMocks());

  it("throws when orderId is missing", () => {
    expect(() => observeOrder({ orderId: "" })).toThrow(
      "Order ID is required for socket connection"
    );
  });

  it("creates a socket and exposes control methods", () => {
    const result = observeOrder({ orderId: "order-1" });

    expect(mockCreateSocket).toHaveBeenCalledTimes(1);
    expect((mockCreateSocket as jest.Mock).mock.calls[0][0]).toMatchObject({
      orderId: "order-1",
    });
    expect(typeof result.connect).toBe("function");
    expect(typeof result.disconnect).toBe("function");
    expect(typeof result.isConnected).toBe("function");
  });

  it("on successful connect, reports connected status then onConnect", async () => {
    mockConnect.mockResolvedValue(undefined);
    const onConnectionStatusChange = jest.fn();
    const onConnect = jest.fn();

    const result = observeOrder({
      orderId: "order-1",
      onConnectionStatusChange,
      onConnect,
    });
    await result.connect();

    expect(mockConnect).toHaveBeenCalled();
    expect(onConnectionStatusChange).toHaveBeenCalledWith(true);
    expect(onConnect).toHaveBeenCalled();
  });

  it("on failed connect, calls onError and rethrows", async () => {
    mockConnect.mockRejectedValue(new Error("connection refused"));
    const onError = jest.fn();

    const result = observeOrder({ orderId: "order-1", onError });

    await expect(result.connect()).rejects.toThrow("connection refused");
    expect(onError).toHaveBeenCalledWith("connection refused");
  });

  it("disconnect tears down the socket and reports status", () => {
    const onConnectionStatusChange = jest.fn();
    const onDisconnect = jest.fn();

    const result = observeOrder({
      orderId: "order-1",
      onConnectionStatusChange,
      onDisconnect,
    });
    result.disconnect();

    expect(mockDisconnect).toHaveBeenCalled();
    expect(onConnectionStatusChange).toHaveBeenCalledWith(false);
    expect(onDisconnect).toHaveBeenCalled();
  });

  it("isConnected delegates to the underlying socket", () => {
    mockIsConnected.mockReturnValue(true);
    const result = observeOrder({ orderId: "order-1" });
    expect(result.isConnected()).toBe(true);
  });
});
