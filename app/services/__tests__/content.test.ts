import { describe, it, expect } from 'vitest';
import { services, getService, ACCENT_CLASSES, type ServiceSlug } from '../content';

/**
 * `services` is hand-authored content that feeds the /services routes, the
 * sitemap, and the nav. A typo in a slug, accent, or tier silently breaks a
 * page or the build. These tests act as a schema guard for that content.
 */

const VALID_ACCENTS = ['indigo', 'violet', 'cyan', 'sky', 'amber', 'emerald'] as const;
const VALID_TIERS = ['featured', 'secondary'] as const;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe('services content', () => {
  it('is non-empty', () => {
    expect(services.length).toBeGreaterThan(0);
  });

  it('has unique slugs', () => {
    const slugs = services.map(s => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(services)('"$slug" has a valid, URL-safe slug', service => {
    expect(service.slug).toMatch(SLUG_RE);
  });

  it.each(services)('"$slug" uses a known accent and tier', service => {
    expect(VALID_ACCENTS).toContain(service.accent);
    expect(VALID_TIERS).toContain(service.tier);
  });

  it.each(services)('"$slug" has the required copy fields populated', service => {
    expect(service.shortTitle.length).toBeGreaterThan(0);
    expect(service.title.length).toBeGreaterThan(0);
    expect(service.tagline.length).toBeGreaterThan(0);
    expect(service.ctaLabel.length).toBeGreaterThan(0);
    expect(service.highlights.length).toBeGreaterThan(0);
    expect(service.problem.length).toBeGreaterThan(0);
    expect(service.approach.length).toBeGreaterThan(0);
    expect(service.stack.length).toBeGreaterThan(0);
    expect(service.useCases.length).toBeGreaterThan(0);
    expect(service.faq.length).toBeGreaterThan(0);
  });

  it('has a non-empty meta description within a reasonable upper bound', () => {
    // Google typically truncates around ~160 chars; we guard against empty or
    // runaway descriptions rather than enforcing an exact SEO cutoff.
    for (const service of services) {
      expect(service.metaDescription.length).toBeGreaterThan(0);
      expect(
        service.metaDescription.length,
        `${service.slug} metaDescription is unusually long`,
      ).toBeLessThanOrEqual(200);
    }
  });

  it('has at least one featured service', () => {
    expect(services.some(s => s.tier === 'featured')).toBe(true);
  });
});

describe('getService', () => {
  it('returns the matching service for a known slug', () => {
    const slug = services[0]?.slug as ServiceSlug;
    const found = getService(slug);
    expect(found).toBeDefined();
    expect(found?.slug).toBe(slug);
  });

  it('returns undefined for an unknown slug', () => {
    expect(getService('does-not-exist')).toBeUndefined();
  });
});

describe('ACCENT_CLASSES', () => {
  it('defines a class set for every accent used by a service', () => {
    for (const service of services) {
      expect(ACCENT_CLASSES[service.accent]).toBeDefined();
      expect(ACCENT_CLASSES[service.accent].text.length).toBeGreaterThan(0);
    }
  });
});
