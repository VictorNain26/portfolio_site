import Script from 'next/script';

import { CAL_LINK, CAL_ORIGIN, CAL_UI_CONFIG } from '@/lib/cal';

const CONTAINER_ID = 'cal-booker';

/**
 * Booker Cal.com en embed *inline* : la réservation est une section de la page
 * plutôt qu'une modale. Le cadre de la modale (`cal-modal-box`) est un composant
 * en shadow DOM sans hook de style ; en inline il n'existe pas, et seule
 * l'iframe reste — thémée par les variables CSS de `CAL_UI_CONFIG`.
 *
 * Le snippet officiel expose `Cal` comme une file d'instructions dès qu'il est
 * évalué : `inline` peut donc être demandé immédiatement, il sera rejoué quand
 * embed.js aura fini de charger. Aucun JS côté React n'est nécessaire, et le
 * conteneur est rendu côté serveur, donc présent quand la file est traitée.
 */
export default function CalInlineBooker({ className }: { className?: string }) {
  return (
    <>
      <div className={className} id={CONTAINER_ID} />
      <Script id="cal-inline-embed" strategy="afterInteractive">
        {`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", ${JSON.stringify({ origin: CAL_ORIGIN })});
Cal("ui", ${JSON.stringify(CAL_UI_CONFIG)});
Cal("inline", ${JSON.stringify({
          calLink: CAL_LINK,
          elementOrSelector: `#${CONTAINER_ID}`,
          config: { layout: 'month_view', theme: 'dark' },
        })});`}
      </Script>
    </>
  );
}
