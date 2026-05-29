import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { notifyIndexNow } from '../indexnow';

/**
 * `notifyIndexNow` pings the IndexNow endpoints for Bing/Yandex/etc. It must
 * post the correct payload to both endpoints and never throw — a failing
 * endpoint is logged, not propagated.
 */

describe('notifyIndexNow', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ status: 200 } as Response);
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('posts to both the IndexNow and Bing endpoints', async () => {
    await notifyIndexNow(['https://victorlenain.fr/blog/new-post']);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const calledEndpoints = fetchMock.mock.calls.map(c => c[0]);
    expect(calledEndpoints).toContain('https://api.indexnow.org/indexnow');
    expect(calledEndpoints).toContain('https://www.bing.com/indexnow');
  });

  it('sends the expected JSON payload with the URL list', async () => {
    const urls = ['https://victorlenain.fr/a', 'https://victorlenain.fr/b'];
    await notifyIndexNow(urls);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string);
    expect(body).toMatchObject({
      host: 'victorlenain.fr',
      urlList: urls,
    });
    expect(body.key).toBeTruthy();
    expect(body.keyLocation).toContain(body.key);
  });

  it('does not throw when an endpoint rejects', async () => {
    fetchMock
      .mockResolvedValueOnce({ status: 200 } as Response)
      .mockRejectedValueOnce(new Error('endpoint down'));

    await expect(notifyIndexNow(['https://victorlenain.fr/x'])).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });
});
