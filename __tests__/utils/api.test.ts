const mockRequest = jest.fn();

jest.mock("../../utils/axios.js", () => ({
  __esModule: true,
  default: { request: mockRequest },
}));

import { get, post, put, patch, del } from "../../utils/api.js";

describe("api request wrapper", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("get() sends method/url with params + headers and returns response.data", async () => {
    mockRequest.mockResolvedValue({ data: { ok: true } });

    const result = await get("/pub/thing", { a: 1 }, { "x-api-key": "key" });

    expect(result).toEqual({ ok: true });
    expect(mockRequest).toHaveBeenCalledWith({
      method: "get",
      url: "/pub/thing",
      data: undefined,
      params: { a: 1 },
      headers: { "x-api-key": "key" },
    });
  });

  it("post() sends method/url with data + headers", async () => {
    mockRequest.mockResolvedValue({ data: { id: "1" } });

    const result = await post("/pub/thing", { name: "x" }, { Authorization: "Bearer t" });

    expect(result).toEqual({ id: "1" });
    expect(mockRequest).toHaveBeenCalledWith({
      method: "post",
      url: "/pub/thing",
      data: { name: "x" },
      params: undefined,
      headers: { Authorization: "Bearer t" },
    });
  });

  it.each([
    ["put", put],
    ["patch", patch],
  ] as const)("%s() sends data + headers", async (method, fn) => {
    mockRequest.mockResolvedValue({ data: { updated: true } });

    await fn("/pub/thing", { v: 2 }, { h: "1" });

    expect(mockRequest).toHaveBeenCalledWith({
      method,
      url: "/pub/thing",
      data: { v: 2 },
      params: undefined,
      headers: { h: "1" },
    });
  });

  it("del() maps to the delete method with data + headers", async () => {
    mockRequest.mockResolvedValue({ data: { deleted: true } });

    await del("/pub/thing", { v: 2 }, { h: "1" });

    expect(mockRequest).toHaveBeenCalledWith({
      method: "delete",
      url: "/pub/thing",
      data: { v: 2 },
      params: undefined,
      headers: { h: "1" },
    });
  });

  it("throws error.response.data when present", async () => {
    mockRequest.mockRejectedValue({
      response: { data: { message: "bad request" } },
      message: "Request failed",
    });

    await expect(get("/pub/thing")).rejects.toEqual({ message: "bad request" });
  });

  it("falls back to error.message when there is no response body", async () => {
    mockRequest.mockRejectedValue({ message: "Network Error" });

    await expect(post("/pub/thing", {})).rejects.toBe("Network Error");
  });
});
