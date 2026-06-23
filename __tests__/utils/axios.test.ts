import api, { setBaseUrl } from "../../utils/axios.js";

describe("axios instance configuration", () => {
  it("defaults to the staging base URL", () => {
    expect(api.defaults.baseURL).toBe("https://api-staging.paj.cash");
  });

  it("setBaseUrl updates the instance default baseURL", () => {
    setBaseUrl("http://localhost:3000");
    expect(api.defaults.baseURL).toBe("http://localhost:3000");

    // restore so test ordering does not leak state
    setBaseUrl("https://api-staging.paj.cash");
    expect(api.defaults.baseURL).toBe("https://api-staging.paj.cash");
  });
});
