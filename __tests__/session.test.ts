import { initiate } from "../lib/utility/session/initiate";
import { deviceSignatureType, verify } from "../lib/utility/session/verify";
import * as api from "../utils/api";

describe("Session", () => {
  const mockEmail = "matthew.chukwuemeka@gmail.com";
  const ApiKey = "ApiKey";

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return session when API call succeeds", async () => {
    jest.spyOn(api, "get").mockResolvedValue({ email: mockEmail });

    const result = await initiate(mockEmail, ApiKey);
    expect(result).toEqual({ email: mockEmail });
  });

  it("should throw an error when API call fails", async () => {
    const error = new Error("API Failure");
    jest.spyOn(api, "get").mockRejectedValue(error);

    await expect(initiate(mockEmail, ApiKey)).rejects.toThrow("API Failure");
  });

  it("Should verify session when API call succeeds", async () => {
    jest.spyOn(api, "get").mockResolvedValue({ email: mockEmail });

    const device: deviceSignatureType = {
      uuid: "uuid",
      device: "device",
      os: "os",
    };
    const result = await verify(mockEmail, "OTP", device, ApiKey);
    expect(result).toEqual({ email: mockEmail });
  });
});
