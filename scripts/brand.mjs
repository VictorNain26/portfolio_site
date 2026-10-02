// One-off generator for public/og.png and the VL icons; satori and resvg are not project dependencies.
// Satori ignores variable axes, so the display cut of Newsreader is frozen first with fontTools:
// T=$(mktemp -d) && cp scripts/brand.mjs "$T" && (cd "$T" &&
//   curl -sLo nr.ttf 'https://github.com/google/fonts/raw/main/ofl/newsreader/Newsreader%5Bopsz,wght%5D.ttf' &&
//   uvx fonttools varLib.instancer nr.ttf wght=500 opsz=72 -q -o newsreader.ttf &&
//   npm init -y >/dev/null && npm i --silent satori@0.34 @resvg/resvg-js@2.6 &&
//   mkdir public && node brand.mjs) && cp "$T"/public/* public/
import { Resvg } from '@resvg/resvg-js';
import { readFile, writeFile } from 'node:fs/promises';
import satori from 'satori';

const fonts = [{ name: 'Newsreader', data: await readFile('newsreader.ttf'), weight: 500 }];
const light = { bg: '#ffffff', fg: '#141414', muted: '#5c5c5c' };
const dark = { bg: '#121212', fg: '#ebebeb' };

const box = (width, height, style, children) =>
  satori(
    {
      type: 'div',
      props: {
        style: { width, height, display: 'flex', fontFamily: 'Newsreader', ...style },
        children,
      },
    },
    { width, height, fonts },
  );

const png = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();

// The line box reserves room for descenders; the top margin puts the capitals on the optical centre.
const mark = (color, fontSize) => ({
  type: 'div',
  props: {
    style: { color, fontSize, lineHeight: 1, letterSpacing: '-0.02em', marginTop: '0.25em' },
    children: 'VL',
  },
});

// Square icons; `size` is the mark's share of the side, maskable ones stay inside the 80% safe circle.
const icon = size =>
  box(100, 100, { background: light.bg, alignItems: 'center', justifyContent: 'center' }, [
    mark(light.fg, size),
  ]);

// Transparent marks: logo-email.png sits on light mail backgrounds, logo.png on dark ones.
const logo = color =>
  box(130, 70, { alignItems: 'center', justifyContent: 'center' }, [mark(color, 56)]);

const og = await box(
  1200,
  630,
  { flexDirection: 'column', justifyContent: 'flex-end', padding: 96, background: light.bg },
  [
    {
      type: 'div',
      props: {
        style: { fontSize: 140, color: light.fg, lineHeight: 1 },
        children: 'Victor Lenain',
      },
    },
    {
      type: 'div',
      props: {
        style: { fontSize: 46, color: light.muted, marginTop: 28 },
        children: 'Développeur · Paris',
      },
    },
  ],
);

const files = {
  'og.png': png(og, 1200),
  'favicon.ico': png(await icon(62), 48),
  'apple-touch-icon.png': png(await icon(52), 180),
  'web-app-manifest-192x192.png': png(await icon(44), 192),
  'web-app-manifest-512x512.png': png(await icon(44), 512),
  'logo-email.png': png(await logo(light.fg), 130),
  'logo.png': png(await logo(dark.fg), 130),
};

for (const [name, data] of Object.entries(files)) await writeFile(`public/${name}`, data);
