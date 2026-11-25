import Color from 'colorjs.io';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The light tokens come first in global.css, the dark ones second: each theme's text colours
// must pass WCAG AA (4.5:1) on its own background. https://colorjs.io/docs/contrast
const css = readFileSync(new URL('./global.css', import.meta.url), 'utf8');
const tokens = (name: string) =>
  [...css.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`, 'g'))].map(match => match[1]!);
const [bg, fg, muted] = (['bg', 'fg', 'muted'] as const).map(tokens);
const ratio = (text: string, background: string) =>
  new Color(background).contrast(new Color(text), 'WCAG21');

describe.each([
  ['light', 0],
  ['dark', 1],
] as const)('%s theme', (_theme, i) => {
  it('defines its background, text and muted colours', () => {
    expect([bg![i], fg![i], muted![i]].every(Boolean)).toBe(true);
  });

  it('keeps the text and the muted text at 4.5:1 or more on the background', () => {
    expect(ratio(fg![i]!, bg![i]!)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(muted![i]!, bg![i]!)).toBeGreaterThanOrEqual(4.5);
  });
});

it('matches the --muted ratios the design rules give (6.69:1 light, 7.70:1 dark)', () => {
  expect(ratio(muted![0]!, bg![0]!)).toBeCloseTo(6.69, 1);
  expect(ratio(muted![1]!, bg![1]!)).toBeCloseTo(7.7, 1);
});
