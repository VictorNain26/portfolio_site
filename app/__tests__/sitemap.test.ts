import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * The sitemap must list static pages + all services + only *published* blog
 * posts (future-dated posts are scheduled and must stay out). Featured
 * services get a higher priority than secondary ones. We mock the two content
 * sources so the test is deterministic regardless of real content.
 */

vi.mock('content-collections', () => ({
  allPosts: [
    { slug: 'past-post', publishedAt: '2025-01-01' },
    { slug: 'future-post', publishedAt: '2099-01-01' },
  ],
}));

vi.mock('../services/content', () => ({
  services: [
    { slug: 'featured-service', tier: 'featured' },
    { slug: 'secondary-service', tier: 'secondary' },
  ],
}));

import sitemap from '../sitemap';

const BASE = 'https://victorlenain.fr';

describe('sitemap', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-29T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('includes the core static pages', () => {
    const urls = sitemap().map(e => e.url);
    expect(urls).toContain(BASE);
    expect(urls).toContain(`${BASE}/blog`);
    expect(urls).toContain(`${BASE}/services`);
  });

  it('includes a URL for every service', () => {
    const urls = sitemap().map(e => e.url);
    expect(urls).toContain(`${BASE}/services/featured-service`);
    expect(urls).toContain(`${BASE}/services/secondary-service`);
  });

  it('gives featured services a higher priority than secondary ones', () => {
    const entries = sitemap();
    const featured = entries.find(e => e.url.endsWith('/featured-service'));
    const secondary = entries.find(e => e.url.endsWith('/secondary-service'));
    expect(featured?.priority).toBe(0.85);
    expect(secondary?.priority).toBe(0.7);
  });

  it('lists published blog posts but excludes future-dated ones', () => {
    const urls = sitemap().map(e => e.url);
    expect(urls).toContain(`${BASE}/blog/past-post`);
    expect(urls).not.toContain(`${BASE}/blog/future-post`);
  });

  it('stamps blog entries with the post publish date as lastModified', () => {
    const entry = sitemap().find(e => e.url.endsWith('/blog/past-post'));
    expect(entry?.lastModified).toEqual(new Date('2025-01-01'));
  });
});
