import { post } from "../../../utils/api.js";

type InitiateResponse = {
  recipient: string;
};

export const initiate = async (recipient: string, apiKey: string) => {
  let body;

  try {
    if (isNaN(+recipient)) body = { email: recipient };
    else body = { phone: recipient };

    return await post<InitiateResponse>("/pub/initiate", body, {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    });
  } catch (err) {
    console.error("Error initiating:", err);
    throw err;
  }
};
