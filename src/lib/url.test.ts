import { describe, expect, it } from 'vitest';
import { canonicalUrl } from './url';

const site = new URL('https://www.victorlenain.fr');

describe('canonicalUrl', () => {
  it('maps the home page to the origin', () => {
    expect(canonicalUrl('/index.html', site)).toBe('https://www.victorlenain.fr/');
    expect(canonicalUrl('/', site)).toBe('https://www.victorlenain.fr/');
  });

  it('strips the .html extension added by build.format "file"', () => {
    expect(canonicalUrl('/blog.html', site)).toBe('https://www.victorlenain.fr/blog');
    expect(canonicalUrl('/blog/mon-article.html', site)).toBe(
      'https://www.victorlenain.fr/blog/mon-article',
    );
  });

  it('leaves clean paths untouched', () => {
    expect(canonicalUrl('/projets', site)).toBe('https://www.victorlenain.fr/projets');
  });
});
