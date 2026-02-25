const INDEXNOW_KEY = '1a09ed4391564f649e827b97f1b3c59a';
const SITE_URL = 'https://victorlenain.fr';

/**
 * Notify IndexNow-compatible search engines (Bing, Yandex, Naver, Seznam)
 * about new or updated URLs.
 */
export async function notifyIndexNow(urls: string[]) {
  const payload = {
    host: 'victorlenain.fr',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  const results = await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      return { endpoint, status: res.status };
    }),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { endpoint, status } = result.value;
      console.log(`IndexNow ${endpoint}: ${status === 200 || status === 202 ? 'OK' : status}`);
    } else {
      console.error('IndexNow error:', result.reason);
    }
  }
}
