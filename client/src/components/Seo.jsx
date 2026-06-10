import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.juiceestation.co.uk';
const SITE_NAME = 'JUICEeSTATION';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

/**
 * Per-route SEO head tags. Renders title, description, canonical, Open Graph,
 * Twitter Card and optional JSON-LD for a single page.
 *
 * @param {string} title        Page title (site name is appended automatically).
 * @param {string} description  Meta description (~150-160 chars ideal).
 * @param {string} path         Route path, e.g. "/menu". Used for canonical + og:url.
 * @param {boolean} [noindex]   When true, tells crawlers not to index the page.
 * @param {string} [image]      Absolute OG image URL. Defaults to the brand logo.
 * @param {object} [jsonLd]     Optional Schema.org object rendered as JSON-LD.
 */
export default function Seo({ title, description, path = '/', noindex = false, image = DEFAULT_IMAGE, jsonLd }) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
      />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
