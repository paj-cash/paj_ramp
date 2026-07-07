import {
  Currency,
  RateType,
  Environment,
  TransactionStatus,
  TransactionType,
  IdType,
  Country,
} from "../../utils/enums.js";

describe("enum wire values", () => {
  it("Currency values match the API contract", () => {
    expect({ ...Currency }).toEqual({
      NGN: "NGN",
      GHS: "GHS",
      TZS: "TZS",
      KES: "KES",
      ZAR: "ZAR",
      USD: "USD",
    });
  });

  it("RateType values match the API contract", () => {
    expect({ ...RateType }).toEqual({ onRamp: "onRamp", offRamp: "offRamp" });
  });

  it("Environment values match the API contract", () => {
    expect({ ...Environment }).toEqual({
      Staging: "staging",
      Production: "production",
      Local: "local",
    });
  });

  it("TransactionStatus values match the API contract", () => {
    expect({ ...TransactionStatus }).toEqual({
      INIT: "INIT",
      PAID: "PAID",
      COMPLETED: "COMPLETED",
    });
  });

  it("TransactionType values match the API contract", () => {
    expect({ ...TransactionType }).toEqual({
      onRamp: "ON_RAMP",
      offRamp: "OFF_RAMP",
    });
  });

  it("IdType values match the API contract", () => {
    expect({ ...IdType }).toEqual({ NIN: "NIN", BVN: "BVN" });
  });

  it("Country values match the API contract", () => {
    expect({ ...Country }).toEqual({
      NG: "NG",
      GH: "GH",
      TZ: "TZ",
      KE: "KE",
      ZA: "ZA",
    });
  });
});
