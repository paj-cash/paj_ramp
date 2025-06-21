import { getTXPoolAddress } from '../lib/getTXPoolAddress';
import * as api from '../utils/api';

describe('getTXPoolAddress', () => {
  const mockAddress = 'FakeSolanaAddress123';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return tx pool address when API call succeeds', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ address: mockAddress });

    const result = await getTXPoolAddress();
    expect(result).toEqual({ address: mockAddress });
  });

  it('should throw an error when API call fails', async () => {
    const error = new Error('API Failure');
    jest.spyOn(api, 'get').mockRejectedValue(error);

    await expect(getTXPoolAddress()).rejects.toThrow('API Failure');
  });
});
