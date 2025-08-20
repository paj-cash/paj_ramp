import { post } from "../../utils/api.js";

type VerifyType = {
  email: string;
  isActive: string;
  expiresAt: string;
  token: string;
};

type deviceSignatureType = {
  uuid: string;
  device: string;
  os?: string;
  browser?: string;
  ip?: string;
};

/**
 * Verifies a user's identity using email, OTP, and device signature via the public API.
 * Returns verification details including email, activation status, expiration, and token, or throws an error if the request fails.
 *
 * Args:
 *   email: The user's email address.
 *   otp: The one-time password for verification.
 *   deviceSignature: The device signature for additional security.
 *
 * Returns:
 *   An object containing email, isActive, expiresAt, and token.
 *
 * Raises:
 *   Throws an error if the request fails.
 */

export const verify = async (
  email: string,
  otp: string,
  deviceSignature: deviceSignatureType,
  apiKey: string
) => {
  try {
    return await post<VerifyType>(
      "/pub/verify",
      {
        email,
        otp,
        device: deviceSignature,
      },
      { "x-api-key": apiKey }
    );
  } catch (err) {
    console.error("Error verifying:", err);
    throw err;
  }
};
