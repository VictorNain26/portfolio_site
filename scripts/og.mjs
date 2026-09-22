// One-off generator for public/og.png; satori and resvg are not project dependencies.
// T=$(mktemp -d) && cp scripts/og.mjs "$T" && (cd "$T" && npm init -y >/dev/null &&
//   npm i --silent satori@0.33 @resvg/resvg-js && mkdir public && node og.mjs) &&
//   cp "$T/public/og.png" public/og.png
import { Resvg } from '@resvg/resvg-js';
import { writeFile } from 'node:fs/promises';
import satori from 'satori';

const fontUrl =
  'https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf';
const font = Buffer.from(await (await fetch(fontUrl)).arrayBuffer());

const text = (fontSize, color, children, extra = {}) => ({
  type: 'div',
  props: { style: { fontSize, color, lineHeight: 1, ...extra }, children },
});

const svg = await satori(
  {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 80,
        background: '#F2EFE8',
        fontFamily: 'Instrument Serif',
      },
      children: [
        text(150, '#16140F', 'Victor Lenain'),
        text(44, '#1F3F95', 'Développeur full-stack · Systèmes IA · Paris', { marginTop: 24 }),
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Instrument Serif', data: font, weight: 400, style: 'normal' }],
  },
);

await writeFile('public/og.png', new Resvg(svg).render().asPng());
