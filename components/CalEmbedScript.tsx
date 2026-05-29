import Script from 'next/script';

/**
 * Charge l'embed Cal.com et ouvre la réservation en modale inline au clic
 * sur tout élément portant `data-cal-link` (cf. CalPopupButton), sans quitter
 * le site — meilleure conversion qu'un saut vers un nouvel onglet.
 *
 * Loader officiel Cal.com. `strategy="afterInteractive"` : ne bloque pas le
 * rendu ; tant qu'il n'est pas exécuté, les boutons restent de simples liens
 * `<a href>` fonctionnels (repli sans JS).
 */
export default function CalEmbedScript() {
  return (
    <Script id="cal-embed" strategy="afterInteractive">
      {`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", { origin: "https://cal.com" });
Cal("ui", { theme: "dark", cssVarsPerTheme: { dark: { "cal-brand": "#6366f1" } }, hideEventTypeDetails: false, layout: "month_view" });`}
    </Script>
  );
}
