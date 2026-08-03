import type { GetServerSideProps } from "next";
import { client } from "@/lib/sanity";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://soundsnare.vercel.app";

const STATIC_PATHS = [
  "/",
  "/blogs",
  "/quotes",
  "/podcast",
  "/about",
  "/blogs/category/general-life",
  "/blogs/category/religion",
  "/blogs/category/health",
  "/blogs/category/nutrition",
  "/blogs/category/survival-skills",
];

type PostRef = { slug: string; updatedAt: string };

function urlEntry(path: string, lastmod?: string) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${path}</loc>`,
    lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

// Served from a page rather than a static file so newly published posts
// appear without a redeploy.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let posts: PostRef[] = [];
  try {
    posts = await client.fetch<PostRef[]>(
      `*[_type == "post" && defined(slug.current)]{
        "slug": slug.current,
        "updatedAt": coalesce(_updatedAt, _createdAt)
      }`
    );
  } catch (error) {
    // A CMS outage should still leave a valid sitemap of static routes.
    console.error("sitemap: failed to fetch posts", error);
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...STATIC_PATHS.map((path) => urlEntry(path)),
    ...posts.map((post) =>
      urlEntry(`/blogs/articles/${post.slug}`, post.updatedAt)
    ),
    "</urlset>",
  ].join("\n");

  res.setHeader("Content-Type", "application/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.write(body);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
