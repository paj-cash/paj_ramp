jest.mock("../../utils/api.js", () => ({
  __esModule: true,
  post: jest.fn(),
}));

import { post } from "../../utils/api.js";
import { createOfframpOrder, CreateOfframpOrder } from "../../lib/off_ramp/createOrder.js";
import { Currency } from "../../utils/enums.js";
import { Chain } from "../../utils/onramp-socket.js";

const postMock = post as jest.Mock;

const order: CreateOfframpOrder = {
  bank: "bank-id",
  accountNumber: "0123456789",
  currency: Currency.NGN,
  amount: 25,
  mint: "mint-address",
  chain: Chain.SOLANA,
  webhookURL: "https://example.com/hook",
  fee: 2,
};

describe("createOfframpOrder", () => {
  afterEach(() => jest.clearAllMocks());

  it("posts to /pub/offramp and renames fee to businessUSDCFee", async () => {
    postMock.mockResolvedValue({ id: "offramp-1" });

    const res = await createOfframpOrder(order, "session-token");

    expect(res).toEqual({ id: "offramp-1" });

    const [url, body, headers] = postMock.mock.calls[0];
    expect(url).toBe("/pub/offramp");
    expect(headers).toEqual({ Authorization: "Bearer session-token" });
    expect(body).toEqual({
      bank: "bank-id",
      accountNumber: "0123456789",
      currency: Currency.NGN,
      amount: 25,
      mint: "mint-address",
      chain: Chain.SOLANA,
      webhookURL: "https://example.com/hook",
      businessUSDCFee: 2,
    });
    expect(body).not.toHaveProperty("fee");
  });

  it("rethrows on failure", async () => {
    postMock.mockRejectedValue({ message: "rejected" });
    await expect(createOfframpOrder(order, "token")).rejects.toEqual({
      message: "rejected",
    });
  });
});
