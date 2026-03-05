import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Tests for blog post filtering logic used in:
 * - generateStaticParams (only published posts)
 * - Blog listing (only published posts)
 * - Blog post page (no date-based notFound)
 */

const mockPosts = [
  {
    title: 'Article passé',
    summary: 'Summary passé',
    publishedAt: '2025-01-12',
    tags: ['React'],
    slug: '2025-01-12-article-passe',
    content: 'Contenu de test pour un article publié dans le passé avec assez de mots',
  },
  {
    title: "Article aujourd'hui",
    summary: "Summary aujourd'hui",
    publishedAt: '2026-03-05',
    tags: ['Next.js', 'Blog'],
    slug: '2026-03-05-article-aujourdhui',
    content: "Contenu de test pour un article publié aujourd'hui",
  },
  {
    title: 'Article futur',
    summary: 'Summary futur',
    publishedAt: '2099-12-31',
    tags: ['Futur'],
    slug: '2099-12-31-article-futur',
    content: 'Contenu futur',
  },
];

// Replicate the filtering logic from generateStaticParams
function getPublishedParams(allPosts: typeof mockPosts, now: Date) {
  return allPosts
    .filter((p) => new Date(p.publishedAt) <= now)
    .map((p) => ({ slug: p.slug }));
}

// Replicate the filtering logic from blog listing
function getPublishedPosts(allPosts: typeof mockPosts, now: Date) {
  return allPosts
    .filter((post) => new Date(post.publishedAt) <= now)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

// Replicate the lookup logic from PostPage (no date filter)
function findPost(allPosts: typeof mockPosts, slug: string) {
  return allPosts.find((p) => p.slug === slug) ?? null;
}

describe('Blog post filtering logic', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-05T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('generateStaticParams logic', () => {
    it('includes past posts', () => {
      const params = getPublishedParams(mockPosts, new Date());
      const slugs = params.map((p) => p.slug);
      expect(slugs).toContain('2025-01-12-article-passe');
    });

    it('includes posts published today', () => {
      const params = getPublishedParams(mockPosts, new Date());
      const slugs = params.map((p) => p.slug);
      expect(slugs).toContain('2026-03-05-article-aujourdhui');
    });

    it('excludes future posts', () => {
      const params = getPublishedParams(mockPosts, new Date());
      const slugs = params.map((p) => p.slug);
      expect(slugs).not.toContain('2099-12-31-article-futur');
    });

    it('returns correct number of published posts', () => {
      const params = getPublishedParams(mockPosts, new Date());
      expect(params).toHaveLength(2);
    });
  });

  describe('Blog listing logic', () => {
    it('only returns published posts', () => {
      const published = getPublishedPosts(mockPosts, new Date());
      expect(published).toHaveLength(2);
      expect(published.every((p) => new Date(p.publishedAt) <= new Date())).toBe(true);
    });

    it('sorts newest first', () => {
      const published = getPublishedPosts(mockPosts, new Date());
      expect(published[0].slug).toBe('2026-03-05-article-aujourdhui');
      expect(published[1].slug).toBe('2025-01-12-article-passe');
    });
  });

  describe('Post page lookup (no date filter)', () => {
    it('finds past post by slug', () => {
      const post = findPost(mockPosts, '2025-01-12-article-passe');
      expect(post).not.toBeNull();
      expect(post?.title).toBe('Article passé');
    });

    it('finds today post by slug', () => {
      const post = findPost(mockPosts, '2026-03-05-article-aujourdhui');
      expect(post).not.toBeNull();
    });

    it('finds future post by slug (accessible via direct URL)', () => {
      const post = findPost(mockPosts, '2099-12-31-article-futur');
      expect(post).not.toBeNull();
      expect(post?.title).toBe('Article futur');
    });

    it('returns null for non-existing slug', () => {
      const post = findPost(mockPosts, 'non-existing-slug');
      expect(post).toBeNull();
    });
  });

  describe('Reading time calculation', () => {
    it('calculates reading time correctly', () => {
      const wordsPerMinute = 200;
      const words = mockPosts[0].content.split(/\s+/);
      const readingTime = Math.ceil(words.length / wordsPerMinute);
      expect(readingTime).toBeGreaterThan(0);
      expect(readingTime).toBe(1); // short content = 1 min
    });
  });
});
