jest.mock("../../utils/api.js", () => ({
  __esModule: true,
  get: jest.fn(),
  post: jest.fn(),
}));

import { get, post } from "../../utils/api.js";
import { getTokenInfo } from "../../lib/utility/token/getTokenInfo.js";
import { submitKyc } from "../../lib/utility/kyc/submitKyc.js";
import { getAllTransactions } from "../../lib/utility/transaction/getAllTransactions.js";
import { getTransaction } from "../../lib/utility/transaction/getTransaction.js";
import { Chain } from "../../utils/onramp-socket.js";
import { Country, IdType } from "../../utils/enums.js";

const getMock = get as jest.Mock;
const postMock = post as jest.Mock;

describe("token info", () => {
  afterEach(() => jest.clearAllMocks());

  it("getTokenInfo GETs /token/:mint with the chain query", async () => {
    getMock.mockResolvedValue({ symbol: "USDC" });

    const res = await getTokenInfo("mint-address", Chain.SOLANA);

    expect(res).toEqual({ symbol: "USDC" });
    expect(getMock).toHaveBeenCalledWith("/token/mint-address?chain=SOLANA");
  });
});

describe("KYC", () => {
  afterEach(() => jest.clearAllMocks());

  it("submitKyc POSTs /pub/kyc with idNumber/idType/country and bearer auth", async () => {
    postMock.mockResolvedValue({ message: "submitted" });

    const res = await submitKyc("token", "12345678901", IdType.BVN, Country.NG);

    expect(res).toEqual({ message: "submitted" });
    expect(postMock).toHaveBeenCalledWith(
      "/pub/kyc",
      { idNumber: "12345678901", idType: IdType.BVN, country: Country.NG },
      { Authorization: "Bearer token" }
    );
  });
});

describe("transactions", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllTransactions GETs /pub/transactions with bearer auth", async () => {
    getMock.mockResolvedValue([{ id: "t1" }]);

    await getAllTransactions("token");

    expect(getMock).toHaveBeenCalledWith(
      "/pub/transactions",
      {},
      { Authorization: "Bearer token" }
    );
  });

  it("getTransaction GETs /pub/transactions/:id with bearer auth", async () => {
    getMock.mockResolvedValue({ id: "t1" });

    await getTransaction("token", "t1");

    expect(getMock).toHaveBeenCalledWith(
      "/pub/transactions/t1",
      {},
      { Authorization: "Bearer token" }
    );
  });

  it("rethrows on failure", async () => {
    getMock.mockRejectedValue({ message: "err" });
    await expect(getTransaction("token", "t1")).rejects.toEqual({
      message: "err",
    });
  });
});
