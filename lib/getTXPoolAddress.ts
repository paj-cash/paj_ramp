import { get } from '../utils/api.js';

export const getTXPoolAddress = async () => {
  try{
    return await get<string>('/pub/txpool-address');
  }catch(err){
    console.error('Error fetching TX Pool Address:', err);
    throw err;
  }
};
