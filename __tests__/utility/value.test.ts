jest.mock("../../utils/api.js", () => ({
  __esModule: true,
  get: jest.fn(),
}));

import { get } from "../../utils/api.js";
import { getOnrampValue } from "../../lib/utility/value/getOnrampValue.js";
import { getOfframpValue, ValueQuery } from "../../lib/utility/value/getOfframpValue.js";
import { Currency } from "../../utils/enums.js";

const getMock = get as jest.Mock;

const query: ValueQuery = {
  fiatAmount: 5000,
  mint: "mint-address",
  currency: Currency.NGN,
};

describe("value conversions", () => {
  afterEach(() => jest.clearAllMocks());

  it("getOnrampValue GETs /pub/rates/onramp-value with the query as params and bearer auth", async () => {
    getMock.mockResolvedValue({ rate: 1, tokenRate: 1 });

    const res = await getOnrampValue(query, "session-token");

    expect(res).toEqual({ rate: 1, tokenRate: 1 });
    expect(getMock).toHaveBeenCalledWith("/pub/rates/onramp-value", query, {
      Authorization: "Bearer session-token",
    });
  });

  it("getOfframpValue GETs /pub/rates/offramp-value with the query as params and bearer auth", async () => {
    getMock.mockResolvedValue({ fiatAmount: 5000, tokenRate: 1 });

    await getOfframpValue(query, "session-token");

    expect(getMock).toHaveBeenCalledWith("/pub/rates/offramp-value", query, {
      Authorization: "Bearer session-token",
    });
  });

  it("rethrows on failure", async () => {
    getMock.mockRejectedValue({ message: "nope" });
    await expect(getOnrampValue(query, "token")).rejects.toEqual({
      message: "nope",
    });
  });
});
