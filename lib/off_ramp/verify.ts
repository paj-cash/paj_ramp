import { post } from "../../utils/api.js";

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
  deviceSignature: string
) => {
  try {
    return await post<{
      email: string;
      isActive: string;
      expiresAt: string;
      token: string;
    }>(
      "/pub/verify",
      { email, otp, deviceSignature },
      { "x-api-key": "3ada687e-78d1-45f3-933d-c992adcc2bbb" }
    );
  } catch (err) {
    console.error("Error verifying:", err);
    throw err;
  }
};
