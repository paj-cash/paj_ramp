import { post } from "../../../utils/api.js";

export interface Verify {
  recipient: string;
  isActive: string;
  expiresAt: string;
  token: string;
}

export interface DeviceSignature {
  uuid: string;
  device: string;
  os?: string;
  browser?: string;
  ip?: string;
}

export const verify = async (
  recipient: string,
  otp: string,
  device: DeviceSignature,
  apiKey: string
) => {
  let body;

  try {
    if (isNaN(+recipient)) body = { email: recipient, otp, device };
    else body = { phone: recipient, otp, device };

    return await post<Verify>("/pub/verify", body, { "x-api-key": apiKey });
  } catch (err) {
    console.error("Error verifying:", err);
    throw err;
  }
};
