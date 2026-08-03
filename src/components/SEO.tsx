import Head from "next/head";

export const DEFAULT_TITLE = "Sound Snare";
export const DEFAULT_DESCRIPTION =
  "A blog addressing health, nutrition, religion, survival skills and life.";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = "/images/default-og.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
}) => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://soundsnare.vercel.app";
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={fullUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Sound Snare" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Additional meta tags */}
      <meta name="author" content="Sound Snare" />
      <meta name="theme-color" content="#000000" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://cdn.sanity.io" />
      <link rel="dns-prefetch" href="https://cdn.sanity.io" />
    </Head>
  );
};

export default SEO;
