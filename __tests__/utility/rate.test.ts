jest.mock("../../utils/api.js", () => ({
  __esModule: true,
  get: jest.fn(),
}));

import { get } from "../../utils/api.js";
import { getAllRate } from "../../lib/utility/rate/getAllRate.js";
import { getRateByAmount } from "../../lib/utility/rate/getRateByAmount.js";
import { getRateByType } from "../../lib/utility/rate/getRateByType.js";
import { RateType } from "../../utils/enums.js";

const getMock = get as jest.Mock;

describe("rate endpoints", () => {
  afterEach(() => jest.clearAllMocks());

  it("getAllRate GETs /pub/rate", async () => {
    getMock.mockResolvedValue({ onRampRate: {}, offRampRate: {} });

    const res = await getAllRate();

    expect(res).toEqual({ onRampRate: {}, offRampRate: {} });
    expect(getMock).toHaveBeenCalledWith("/pub/rate");
  });

  it("getRateByAmount puts the amount in the path", async () => {
    getMock.mockResolvedValue({ rate: {}, amounts: {} });

    await getRateByAmount(1500);

    expect(getMock).toHaveBeenCalledWith("/pub/rate/1500");
  });

  it("getRateByType puts the rate type in the path", async () => {
    getMock.mockResolvedValue({ rate: 1 });

    await getRateByType(RateType.onRamp);

    expect(getMock).toHaveBeenCalledWith("/pub/rate/onRamp");
  });

  it("rethrows on failure", async () => {
    getMock.mockRejectedValue({ message: "down" });
    await expect(getAllRate()).rejects.toEqual({ message: "down" });
  });
});
