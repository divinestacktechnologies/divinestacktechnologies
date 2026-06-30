// src/components/SEO.jsx
// Per-page dynamic SEO — title, description, OG, Twitter, canonical, schema
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Divine Stack Technologies';
const SITE_URL  = 'https://www.divinestacktechnologies.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const TWITTER_HANDLE = '@divinestacktech';

export default function SEO({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  schema = null,        // pass an object or array of JSON-LD objects
  breadcrumbs = null,   // [{name, path}]
  noindex = false,
  geoRegion = 'IN-UP',
  geoPlace = 'Uttar Pradesh, India',
  geoLat = 28.5706,
  geoLong = 77.5835,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Web, App & Digital Solutions`;
  const canonical = `${SITE_URL}${path}`;

  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: `${SITE_URL}${b.path}`,
    })),
  } : null;

  const schemas = [
    ...(schema ? (Array.isArray(schema) ? schema : [schema]) : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ];

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* GEO — geo-targeting for location-based discovery */}
      <meta name="geo.region" content={geoRegion} />
      <meta name="geo.placename" content={geoPlace} />
      <meta name="geo.position" content={`${geoLat};${geoLong}`} />
      <meta name="ICBM" content={`${geoLat}, ${geoLong}`} />

      {/* AEO — answer engine optimization */}
      <meta name="speakable" content="true" />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema(s) */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
}
