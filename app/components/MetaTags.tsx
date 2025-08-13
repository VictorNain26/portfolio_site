export default function MetaTags() {
  return (
    <>
      <meta content="victorlenain" name="Victor-Lenain" />

      {/* ---- Favicons et icônes ---- */}
      <link href="/favicon.ico" rel="icon" sizes="48x48" />
      <link href="/icon0.svg" rel="icon" type="image/svg+xml" />
      <link href="/apple-icon.png" rel="apple-touch-icon" />
      <link href="/manifest.json" rel="manifest" />
      <meta content="#6366f1" name="theme-color" />
      <meta content="#6366f1" name="msapplication-TileColor" />

      {/* ---- SEO et performance ---- */}
      <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
      <meta content="telephone=no" name="format-detection" />
      <meta content="dark" name="color-scheme" />

      {/* ---- Verification et ownership ---- */}
      <meta content="votre-code-verification-google" name="google-site-verification" />
      <meta content="votre-code-verification-bing" name="msvalidate.01" />

      {/* ---- Préchargement de ressources critiques ---- */}
      <link as="image" href="/images/hero-bg.jpg" rel="preload" type="image/jpeg" />
      <link href="//fonts.googleapis.com" rel="dns-prefetch" />
      <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
    </>
  );
}