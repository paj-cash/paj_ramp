import { Keypair } from "@solana/web3.js";
import { getWalletBody } from "../../utils/getWalletBody.js";
import { verifySignature } from "../../utils/verifySignature.js";

describe("getWalletBody", () => {
  const keypair = Keypair.fromSeed(new Uint8Array(32).fill(7));
  const accountId = "account-123";

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns a payload and a signature that verifies against the keypair", async () => {
    const body = await getWalletBody(accountId, keypair.secretKey);

    expect(body).toBeDefined();
    expect(body!.payload.publicKey).toBe(keypair.publicKey.toString());
    expect(body!.payload.accountId).toBe(accountId);
    expect(typeof body!.signature).toBe("string");
    expect(body!.signature.length).toBeGreaterThan(0);

    // timestamp is a valid ISO string
    const parsed = new Date(body!.payload.timestamp);
    expect(parsed.toISOString()).toBe(body!.payload.timestamp);

    // the returned signature verifies against the payload + public key
    expect(
      verifySignature(body!.payload, body!.signature, keypair.publicKey)
    ).toBe(true);
  });

  it("returns undefined and logs when the secret key is invalid", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const body = await getWalletBody(accountId, new Uint8Array(5));

    expect(body).toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});
