const mockSetBaseUrl = jest.fn();

jest.mock("../utils/axios.js", () => ({
  __esModule: true,
  default: {},
  setBaseUrl: mockSetBaseUrl,
}));

import { initializeSDK } from "../sdk.js";
import { Environment } from "../utils/enums.js";

describe("initializeSDK", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [Environment.Staging, "https://api-staging.paj.cash"],
    [Environment.Production, "https://api.paj.cash"],
    [Environment.Local, "http://localhost:3000"],
  ])("maps %s to %s", (env, url) => {
    initializeSDK(env);
    expect(mockSetBaseUrl).toHaveBeenCalledWith(url);
  });

  it("does not change the base URL for an unknown environment", () => {
    initializeSDK("unknown" as Environment);
    expect(mockSetBaseUrl).not.toHaveBeenCalled();
  });
});
