jest.mock("../utils/api.js", () => ({
  __esModule: true,
  post: jest.fn(),
  get: jest.fn(),
}));

import { post } from "../utils/api.js";
import { initiate } from "../lib/utility/session/initiate.js";
import { verify } from "../lib/utility/session/verify.js";

const postMock = post as jest.Mock;

describe("session: initiate", () => {
  afterEach(() => jest.clearAllMocks());

  it("treats a non-numeric recipient as an email", async () => {
    postMock.mockResolvedValue({ email: "user@example.com" });

    const res = await initiate("user@example.com", "api-key-1");

    expect(res).toEqual({ email: "user@example.com" });
    expect(postMock).toHaveBeenCalledWith(
      "/pub/initiate",
      { email: "user@example.com" },
      { "x-api-key": "api-key-1", "Content-Type": "application/json" }
    );
  });

  it("treats a numeric recipient as a phone", async () => {
    postMock.mockResolvedValue({ phone: "08012345678" });

    await initiate("08012345678", "api-key-1");

    expect(postMock).toHaveBeenCalledWith(
      "/pub/initiate",
      { phone: "08012345678" },
      { "x-api-key": "api-key-1", "Content-Type": "application/json" }
    );
  });

  it("rethrows when the request fails", async () => {
    postMock.mockRejectedValue({ message: "boom" });
    await expect(initiate("user@example.com", "key")).rejects.toEqual({
      message: "boom",
    });
  });
});

describe("session: verify", () => {
  const device = { uuid: "uuid-1", device: "iPhone" };

  afterEach(() => jest.clearAllMocks());

  it("verifies an email recipient with otp + device", async () => {
    postMock.mockResolvedValue({ token: "session-token" });

    const res = await verify("user@example.com", "123456", device, "api-key-1");

    expect(res).toEqual({ token: "session-token" });
    expect(postMock).toHaveBeenCalledWith(
      "/pub/verify",
      { email: "user@example.com", otp: "123456", device },
      { "x-api-key": "api-key-1" }
    );
  });

  it("verifies a phone recipient with otp + device", async () => {
    postMock.mockResolvedValue({ token: "session-token" });

    await verify("08012345678", "123456", device, "api-key-1");

    expect(postMock).toHaveBeenCalledWith(
      "/pub/verify",
      { phone: "08012345678", otp: "123456", device },
      { "x-api-key": "api-key-1" }
    );
  });
});
