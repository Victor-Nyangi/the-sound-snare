import type { ReactElement } from "react";
import Layout from "../../../../components/Layout";
import NestedLayout from "../../../../components/NestedLayout";
import type { NextPageWithLayout } from "../../../_app";
import { GetStaticPropsResult } from "next";

import Header from "@/components/Header";

import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { ArticleTypeI } from "../../../../../types";
import { client, reverseCategoryMap } from "@/lib/sanity";

// Static category data for reliable build-time path generation
const STATIC_CATEGORIES = [
  'general-life',
  'religion', 
  'health',
  'nutrition',
  'survival-skills'
];

type Props = {
  articles: ArticleTypeI[];
};

interface Context {
  params: {
    slug: string;
  };
}

const Category: NextPageWithLayout<Props> = ({ articles }: Props) => {
  return (
    <>
      <Header path="/images/general_life.jpg" color="white" />

      <section className="px-4 py-24 mx-auto max-w-7xl">
        <h2 className="mb-2 text-3xl font-extrabold leading-tight text-gray-900">
          Blog Zone
        </h2>
        <p className="mb-20 text-lg text-gray-500">
          Thoughts on life and many topics ranging from finances to society.
        </p>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {/* <div>
            <a href="!#">
              <img
                src="/brand/og.png"
                className="object-cover w-full h-56 mb-5 bg-center rounded"
                alt="Kutty"
                loading="lazy"
              />
            </a>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              <a href="!#" className="text-gray-900 hover:text-purple-700">
                Process Documents Using Artificial Intelligence For RPA Bots
              </a>
            </h2>
            <p className="mb-3 text-sm font-normal text-gray-500">
               …
            </p>
            <p className="mb-3 text-sm font-normal text-gray-500">
              <a
                href="!#"
                className="font-medium text-gray-900 hover:text-purple-700"
              >
                Praveen Juge
              </a>
              • April 16, 2020
            </p>
          </div> */}
          {articles &&
            articles.map((post: ArticleTypeI, index: number) => (
              <div key={post.slug.current}>
                <Link href={post.slug.current}>
                  <Image
                    src={post.mainImage.asset.url}
                    alt="General stuff"
                    className="object-cover w-full h-56 mb-5 bg-center rounded"
                    loading="lazy"
                    width={500}
                    height={100}
                    unoptimized
                  />
                </Link>
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  <Link
                    href={`/blogs/articles/${post.slug.current}`}
                    className="text-gray-900 hover:text-purple-700"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mb-3 text-sm font-normal text-gray-500">
                  {post?.excerpt}
                </p>
                <p className="mb-3 text-sm font-normal text-gray-500">
                  <Link
                    href="!#"
                    className="font-medium text-gray-900 hover:text-purple-700"
                  >
                    {post?.name}
                  </Link>
                  <span className="ml-2">
                    {moment(post._createdAt).format("dddd, MMMM Do YYYY")}
                  </span>
                </p>
              </div>
            ))}
        </div>
        <div className="flex flex-col items-center justify-center mt-20 space-x-0 space-y-2 md:space-x-2 md:space-y-0 md:flex-row">
          <a
            href="!#"
            className="w-full rounded-full btn btn-light btn-xl md:w-auto"
          >
            Previous Page
          </a>
          <a
            href="!#"
            className="w-full rounded-full btn btn-light btn-xl md:w-auto"
          >
            Next Page
          </a>
        </div>
      </section>
    </>
  );
};

Category.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

// Use static categories for reliable build-time path generation
export const getStaticPaths = async () => {
  const paths = STATIC_CATEGORIES.map((slug) => ({
    params: { slug },
  }));
  
  return {
    paths,
    fallback: false,
  };
};

export async function getStaticProps(
  context: Context
): Promise<GetStaticPropsResult<Props>> {
  const { slug } = context.params;
  
  try {
    // Get the category ref from the slug
    const categoryRef = reverseCategoryMap.get(slug);
    if (!categoryRef) {
      return { notFound: true };
    }
    
    const articles = await client.fetch(`
      *[_type == "post" && categories[0]._ref == $categoryRef]{
        title,
        slug,
        mainImage{
          asset->{ _id, url }
        },
        excerpt,
        _createdAt,
        "name": author->name,
      }
    `, { categoryRef });
    
    return {
      props: {
        articles: articles || [],
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps for category:', slug, error);
    return { 
      props: { articles: [] },
      revalidate: 3600,
    };
  }
}

export default Category;
