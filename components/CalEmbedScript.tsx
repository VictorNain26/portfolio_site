import Script from 'next/script';

import { CAL_ORIGIN, CAL_UI_CONFIG } from '@/lib/cal';

/**
 * Loader d'embed Cal.com, copié depuis le générateur de snippets de l'instance
 * — c'est la voie documentée : le snippet est tenu à jour côté Cal.com et doit
 * être repris tel quel, y compris en self-hosting.
 *
 * Il n'est volontairement pas remplacé par `@calcom/embed-react` : ce paquet
 * fige une copie du loader (1.5.3, avril 2025) désynchronisée de l'embed.js
 * servi aujourd'hui, avec lequel `window.Cal.instance` n'est jamais initialisé.
 *
 * `afterInteractive` : ne bloque pas le rendu. Tant que le script n'a pas
 * tourné, les CTA restent de simples liens `<a href>` fonctionnels.
 */
export default function CalEmbedScript() {
  return (
    <Script id="cal-embed" strategy="afterInteractive">
      {`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", ${JSON.stringify({ origin: CAL_ORIGIN })});
Cal("ui", ${JSON.stringify(CAL_UI_CONFIG)});`}
    </Script>
  );
}
