import { get } from "../../../utils/api.js";
import { Chain } from "../../../utils/onramp-socket.js";

export interface TokenInfo {
  name: string;
  symbol: string;
  logo: string;
  mint: string;
  decimals: number;
  chain: Chain;
}

export const getTokenInfo = async (mint: string, chain: Chain) => {
  try {
    return await get<TokenInfo>(`/token/${mint}?chain=${chain}`);
  } catch (err) {
    console.error("Error fetching token info:", err);
    throw err;
  }
};
