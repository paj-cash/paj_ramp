import { Keypair } from "@solana/web3.js";
import { generateSignature } from "../../utils/generateSignature.js";
import { verifySignature, Payload } from "../../utils/verifySignature.js";

describe("generateSignature / verifySignature", () => {
  const keypair = Keypair.fromSeed(new Uint8Array(32).fill(1));
  const otherKeypair = Keypair.fromSeed(new Uint8Array(32).fill(2));

  const payload: Payload = {
    publicKey: keypair.publicKey.toString(),
    accountId: "account-abc",
    timestamp: "2026-06-23T00:00:00.000Z",
  };

  it("produces a non-empty base58 signature", () => {
    const signature = generateSignature(payload, keypair.secretKey);
    expect(typeof signature).toBe("string");
    expect(signature.length).toBeGreaterThan(0);
    // base58 alphabet excludes 0, O, I and l
    expect(signature).not.toMatch(/[0OIl]/);
  });

  it("is deterministic for the same payload + key", () => {
    const a = generateSignature(payload, keypair.secretKey);
    const b = generateSignature(payload, keypair.secretKey);
    expect(a).toBe(b);
  });

  it("round-trips: a freshly signed payload verifies as true", () => {
    const signature = generateSignature(payload, keypair.secretKey);
    expect(verifySignature(payload, signature, keypair.publicKey)).toBe(true);
  });

  it("returns false when the payload is tampered with", () => {
    const signature = generateSignature(payload, keypair.secretKey);
    const tampered: Payload = { ...payload, accountId: "account-xyz" };
    expect(verifySignature(tampered, signature, keypair.publicKey)).toBe(false);
  });

  it("returns false when verified against a different public key", () => {
    const signature = generateSignature(payload, keypair.secretKey);
    expect(verifySignature(payload, signature, otherKeypair.publicKey)).toBe(
      false
    );
  });
});
