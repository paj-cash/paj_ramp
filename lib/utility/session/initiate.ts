import { post } from "../../../utils/api.js";
// Define or import the InitiateResponse type
type InitiateResponse = {
  email: string;
};

/**
 * Initiates a process by sending the provided email to the public API endpoint.
 * Returns the response from the API or throws an error if the request fails.
 *
 * Args:
 *   email: The email address to send in the initiation request.
 *
 * Returns:
 *   The response data from the API.
 *
 * Raises:
 *   Throws an error if the request fails.
 */
export const initiate = async (email: string, apiKey: string) => {
  try {
    return await post<InitiateResponse>(
      "/pub/initiate",
      { email },
      { "x-api-key": apiKey, "Content-Type": "application/json" }
    );
  } catch (err) {
    console.error("Error initiating:", err);
    throw err;
  }
};
