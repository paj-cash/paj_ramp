jest.mock("../../utils/api.js", () => ({
  __esModule: true,
  get: jest.fn(),
  post: jest.fn(),
}));

import { get, post } from "../../utils/api.js";
import { getBanks } from "../../lib/utility/bank/getBanks.js";
import { getBankAccounts } from "../../lib/utility/bank/getBankAccounts.js";
import { resolveBankAccount } from "../../lib/utility/bank/resolveBankAccount.js";
import { addBankAccount } from "../../lib/utility/bank/addBankAccount.js";

const getMock = get as jest.Mock;
const postMock = post as jest.Mock;

describe("bank endpoints", () => {
  afterEach(() => jest.clearAllMocks());

  it("getBanks GETs /pub/bank with bearer auth", async () => {
    getMock.mockResolvedValue([{ id: "b1" }]);

    const res = await getBanks("token");

    expect(res).toEqual([{ id: "b1" }]);
    expect(getMock).toHaveBeenCalledWith(
      "/pub/bank",
      {},
      { Authorization: "Bearer token" }
    );
  });

  it("getBankAccounts GETs /pub/bank-account with bearer auth", async () => {
    getMock.mockResolvedValue([{ id: "a1" }]);

    await getBankAccounts("token");

    expect(getMock).toHaveBeenCalledWith(
      "/pub/bank-account",
      {},
      { Authorization: "Bearer token" }
    );
  });

  it("resolveBankAccount GETs the confirm URL with bankId + accountNumber query", async () => {
    getMock.mockResolvedValue({ accountName: "John Doe" });

    await resolveBankAccount("token", "bank-1", "0123456789");

    expect(getMock).toHaveBeenCalledWith(
      "/pub/bank-account/confirm/?bankId=bank-1&accountNumber=0123456789",
      {},
      { Authorization: "Bearer token" }
    );
  });

  it("addBankAccount POSTs /pub/bank-account with bankId + accountNumber and bearer auth", async () => {
    postMock.mockResolvedValue({ id: "a1" });

    await addBankAccount("token", "bank-1", "0123456789");

    expect(postMock).toHaveBeenCalledWith(
      "/pub/bank-account",
      { bankId: "bank-1", accountNumber: "0123456789" },
      { Authorization: "Bearer token" }
    );
  });

  it("rethrows on failure", async () => {
    getMock.mockRejectedValue({ message: "fail" });
    await expect(getBanks("token")).rejects.toEqual({ message: "fail" });
  });
});
