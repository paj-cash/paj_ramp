import { post } from "../../../utils/api.js";
import { Country, IdType } from "../../../utils/enums.js";

export interface SubmitKyc {
  message: string;
}

/**
 * Submits KYC (government ID) data for the authenticated user.
 * Requires the session to have already completed email verification.
 *
 * Args:
 *   token: The session token returned by `verify`.
 *   idNumber: The user's government ID number (e.g. BVN or NIN value).
 *   idType: The type of ID — `BVN` or `NIN`.
 *   country: The ID-issuing country (`NG`, `GH`, `TZ`, `KE`, `ZA`).
 *
 * Returns:
 *   An object with a `message` confirming successful submission.
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const submitKyc = async (
  token: string,
  idNumber: string,
  idType: IdType,
  country: Country
) => {
  try {
    return await post<SubmitKyc>(
      "/pub/kyc",
      {
        idNumber,
        idType,
        country,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (err) {
    console.error("Error submitting KYC:", err);
    throw err;
  }
};
