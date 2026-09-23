// One-off generator for the VL mark and icons in public/; resvg is not a project dependency.
// T=$(mktemp -d) && cp scripts/logo.mjs "$T" && (cd "$T" && npm init -y >/dev/null &&
//   npm i --silent @resvg/resvg-js && mkdir public && node logo.mjs) &&
//   cp "$T"/public/* public/
import { Resvg } from '@resvg/resvg-js';
import { writeFile } from 'node:fs/promises';

const papers = {
  light: { bg: '#f2efe8', ink: '#16140f', accent: '#1f3f95' },
  dark: { bg: '#1a1813', ink: '#ece6da', accent: '#7b9cf0' },
};

// Broad-nib pen: thin V upstroke, thick downstroke shared by V and L, and the L foot
// drawn as the pen stroke that underlines the name on the home page.
const mark = ({ ink, accent }) => `
  <polygon points="28.5,30 32.5,30 48.5,64 46,67.5" fill="${ink}"/>
  <polygon points="58,30 67,30 51,66.5 42.5,66.5" fill="${accent}"/>
  <path d="M44 65.2 C 52 66, 60 63.2, 72.5 62.8" stroke="${accent}" stroke-width="4.2"
    stroke-linecap="round" fill="none"/>`;

// The mark spans x 28-75, y 30-69 and is centred on (51.5, 49.5).
const square = (paper, scale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${paper.bg}"/>
    <g transform="translate(50 50) scale(${scale}) translate(-51.5 -49.5)">${mark(paper)}</g>
  </svg>`;
const cropped = paper =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="25.5 24.65 52 49.7">${mark(paper)}</svg>`;

const png = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();

// Maskable icons keep the mark inside the 80% safe circle.
const files = {
  'favicon.ico': png(square(papers.light, 1.5), 48),
  'apple-touch-icon.png': png(square(papers.light, 1.4), 180),
  'web-app-manifest-192x192.png': png(square(papers.light, 1.2), 192),
  'web-app-manifest-512x512.png': png(square(papers.light, 1.2), 512),
  // Transparent marks: logo-email.png sits on light mail backgrounds, logo.png on dark ones.
  'logo-email.png': png(cropped(papers.light), 89),
  'logo.png': png(cropped(papers.dark), 89),
};

for (const [name, data] of Object.entries(files)) await writeFile(`public/${name}`, data);
