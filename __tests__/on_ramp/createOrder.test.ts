jest.mock("../../utils/api.js", () => ({
  __esModule: true,
  post: jest.fn(),
}));

import { post } from "../../utils/api.js";
import { createOnrampOrder, CreateOnrampOrder } from "../../lib/on_ramp/createOrder.js";
import { Chain } from "../../utils/onramp-socket.js";

const postMock = post as jest.Mock;

const order: CreateOnrampOrder = {
  fiatAmount: 10000,
  currency: "NGN",
  recipient: "wallet-address",
  mint: "mint-address",
  chain: Chain.SOLANA,
  webhookURL: "https://example.com/hook",
  fee: 5,
};

describe("createOnrampOrder", () => {
  afterEach(() => jest.clearAllMocks());

  it("posts to /pub/onramp and renames fee to businessUSDCFee", async () => {
    postMock.mockResolvedValue({ id: "order-1" });

    const res = await createOnrampOrder(order, "session-token");

    expect(res).toEqual({ id: "order-1" });

    const [url, body, headers] = postMock.mock.calls[0];
    expect(url).toBe("/pub/onramp");
    expect(headers).toEqual({ Authorization: "Bearer session-token" });
    expect(body).toEqual({
      fiatAmount: 10000,
      currency: "NGN",
      recipient: "wallet-address",
      mint: "mint-address",
      chain: Chain.SOLANA,
      webhookURL: "https://example.com/hook",
      businessUSDCFee: 5,
    });
    // the raw `fee` key must not be forwarded
    expect(body).not.toHaveProperty("fee");
  });

  it("rethrows on failure", async () => {
    postMock.mockRejectedValue({ message: "rejected" });
    await expect(createOnrampOrder(order, "token")).rejects.toEqual({
      message: "rejected",
    });
  });
});
