// @vitest-environment node
// `content-collections.ts` pulls in @content-collections/mdx, and the esbuild it
// loads refuses to run under jsdom (its TextEncoder is not a real Uint8Array).

import { describe, expect, it } from 'vitest';

import { postsSchema } from '../content-collections';

const validFrontmatter = {
  title: 'Titre',
  summary: 'Résumé',
  publishedAt: '2026-03-05',
};

describe('posts frontmatter schema', () => {
  it('accepts a well-formed frontmatter and defaults tags to an empty array', () => {
    const parsed = postsSchema.parse(validFrontmatter);

    expect(parsed).toMatchObject({ ...validFrontmatter, tags: [] });
  });

  // `publishedAt` is fed straight to `new Date()` to gate publication, sort the
  // feed and stamp the sitemap. A value the Date constructor cannot parse used
  // to sail through `z.string()` and silently keep the post unpublished, since
  // `new Date('demain') <= now` is false. Fail loudly at build time instead.
  it.each(['2026-3-5', '2026-13-01', '2026-02-31', '2026-03-05T10:00:00Z', 'demain', ''])(
    'rejects %o as publishedAt',
    invalid => {
      expect(postsSchema.safeParse({ ...validFrontmatter, publishedAt: invalid }).success).toBe(
        false,
      );
    },
  );

  it.each(['title', 'summary', 'publishedAt'])('requires %s', field => {
    const withoutField: Record<string, unknown> = { ...validFrontmatter };
    delete withoutField[field];

    expect(postsSchema.safeParse(withoutField).success).toBe(false);
  });
});
