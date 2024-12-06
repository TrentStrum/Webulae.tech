import { renderHook } from '@testing-library/react';

import { usePrefetch } from '@/src/hooks/helpers/use-prefetch';
import { queryClient } from '@/src/lib/cache/queryCache';

describe('Cache System', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('should cache and retrieve data', async () => {
		const testData = { id: '1', name: 'Test User' };
		const fetchMock = jest.fn().mockResolvedValue(testData);

		await queryClient.fetchQuery({
      queryKey: ['user', '1'],
      queryFn: fetchMock,
    });

    // Data should be cached
    const cachedData = queryClient.getQueryData(['user', '1']);
    expect(cachedData).toEqual(testData);
    
    // Subsequent fetches should use cache
    await queryClient.fetchQuery({
      queryKey: ['user', '1'],
      queryFn: fetchMock,
    });
    
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should prefetch user data correctly', async () => {
    const { result } = renderHook(() => usePrefetch());
    
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    await result.current.prefetchUserData();
    
    // Verify cache entries were created
    expect(queryClient.getQueryData(['user', '1'])).toBeDefined();
    expect(queryClient.getQueryData(['projects', '1'])).toBeDefined();
    expect(queryClient.getQueryData(['subscriptions', '1'])).toBeDefined();
  });
});