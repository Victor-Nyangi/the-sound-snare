import type { ReactElement } from "react";
import { server } from '../../../config'
import Layout from "@/components/Layout";
import NestedLayout from "@/components/NestedLayout";
import type { NextPageWithLayout } from "./../_app";
import Header from "../../components/Header";


import Link from "next/link";
import Image from "next/image";
import { ArticleTypeI } from "../../../types";
import LatestArticles from "@/components/Blog/LatestArticles";
import { client } from "../../lib/sanity";

type Props = {
  articles: ArticleTypeI[]
}

const Blog: NextPageWithLayout<Props> = ({ articles }: Props) => {

  return (
    <>
      <Header path="/images/blogs.jpg" color="white" />

      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
              Brand new
            </p>
          </div>
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
            <span className="relative inline-block">
              <span className="relative">Blogs</span>
            </span>
          </h2>
          <p className="text-base text-gray-700 md:text-lg">
            Content for all kinds of readers, irrespective of age and culture.
            Thoughts and knowledge that I&lsquo;d like to share.
          </p>
        </div>
        <div className="grid gap-8 row-gap-5 mb-8 md:row-gap-8 lg:grid-cols-4 sm:grid-cols-2">
          <div className="duration-300 transform bg-white border-l-4 border-purple-700 hover:-translate-y-2">
            <div className="h-full p-5 border border-l-0 rounded-r shadow-sm">
              <h6 className="mb-2 font-semibold leading-5">Victor Nyangi</h6>
              <p className="text-sm text-gray-900">
                Just a regular guy who loves creting and sharing ideas.
              </p>
            </div>
          </div>
          <div className="duration-300 transform bg-white border-l-4 border-purple-700 hover:-translate-y-2">
            <div className="h-full p-5 border border-l-0 rounded-r shadow-sm">
              <h6 className="mb-2 font-semibold leading-5">Wise Man</h6>
              <p className="text-sm text-gray-900">
                A wise young man sharing some wise old thoughts.
              </p>
            </div>
          </div>
          <div className="duration-300 transform bg-white border-l-4 border-purple-700 hover:-translate-y-2">
            <div className="h-full p-5 border border-l-0 rounded-r shadow-sm">
              <h6 className="mb-2 font-semibold leading-5">Comical lad</h6>
              <p className="text-sm text-gray-900">
                Positivity, motivation and joyous thoughts.
              </p>
            </div>
          </div>
          <div className="duration-300 transform bg-white border-l-4 border-purple-700 hover:-translate-y-2">
            <div className="h-full p-5 border border-l-0 rounded-r shadow-sm">
              <h6 className="mb-2 font-semibold leading-5">Dr Smokes</h6>
              <p className="text-sm text-gray-900">Just a smart doctor.</p>
            </div>
          </div>
        </div>
      </div>

    <LatestArticles articles={articles} />

      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="flex flex-col mb-6 lg:justify-between lg:flex-row md:mb-8">
          <h2 className="max-w-lg mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none md:mb-6 group">
            <span className="inline-block mb-1 sm:mb-4">
              Interesting
              <br className="hidden md:block" />
              Content
            </span>
            <div className="h-1 ml-auto duration-300 origin-left transform bg-deep-purple-accent-400 scale-x-30 group-hover:scale-x-100" />
          </h2>
          <p className="text-gray-700 lg:text-sm lg:max-w-md">
            Strive not to be a success, but rather to be of value.
            <i>- Albert Einstein</i>
          </p>
        </div>
        <div className="grid gap-6 row-gap-5 mb-8 lg:grid-cols-4 sm:row-gap-6 sm:grid-cols-2">
          <Link href="/blogs/category/health">
            <Image
              src="/images/health.jpg"
              alt="Health"
              className="object-cover w-full h-56 mb-5 bg-center rounded"
              loading="lazy"
              width={500}
              height={100}
            />
          </Link>

          <Link href="/blogs/category/survival-skills">
            <Image
              src="/images/survival.jpg"
              alt="Survival"
              className="object-cover w-full h-56 mb-5 bg-center rounded"
              loading="lazy"
              width={500}
              height={100}
            />
          </Link>
          <Link href="/blogs/category/nutrition">
            <Image
              src="/images/nutrition.jpg"
              alt="Nutrition"
              className="object-cover w-full h-56 mb-5 bg-center rounded"
              loading="lazy"
              width={500}
              height={100}
            />
          </Link>
          <Link href="/blogs/category/religion">
            <Image
              src="/images/religion.jpg"
              alt="Religion"
              className="object-cover w-full h-56 mb-5 bg-center rounded"
              loading="lazy"
              width={500}
              height={100}
            />
          </Link>
          <Link href="/quotes">
            <Image
              src="/images/s5.jpg"
              alt="Quotes"
              className="object-cover w-full h-56 mb-5 bg-center rounded"
              loading="lazy"
              width={500}
              height={100}
            />
          </Link>
        </div>
        <div className="text-center">
          <Link
            href="!#"
            aria-label=""
            className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
          >
            See more
            <svg
              className="inline-block w-3 ml-2"
              fill="currentColor"
              viewBox="0 0 12 12"
            >
              <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="py-16 bg-yellow-50 overflow-hidden">
        <div className="container m-auto px-6 space-y-8 md:px-12 lg:px-20">
          <div>
            <span className="block w-max mx-auto py-2 px-4 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
              Literature and poetry
            </span>
            <h2 className="mt-4 text-center text-2xl text-yellow-900 font-bold md:text-4xl">
              Only the very weak-minded refuse to be influenced by literature
              and poetry.
              <br className="lg:block" hidden />{" "}
              <span className="italic text-blue-600 text-2xl">Victor Hugo</span>
            </h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 md:-mx-8">
            <div className="relative group">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-xl bg-white shadow-2xl transition duration-300 group-hover:bg-yellow-900 group-hover:scale-105 lg:group-hover:scale-110"
              />
              <div className="relative space-y-12 p-8 md:p-12 lg:p-8 xl:p-12">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 flex justify-center items-center rounded-full bg-yellow-100"
                >
                  <span className="font-bold text-yellow-700">1</span>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl text-gray-800 font-medium transition group-hover:text-white">
                    Quotes
                  </h4>
                  <p className="text-gray-600 group-hover:text-yellow-200">
                    Wise words from past and current wise men and women who were
                    pioneers and greats in their respective fields.
                  </p>
                </div>
                <Image
                  src="/images/s5.jpg"
                  className="w-16 rounded-full h-16"
                  width={512}
                  height={512}
                  alt="Sound snare Quotes"
                />
              </div>
            </div>
            <div className="relative group">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-xl bg-white shadow-2xl transition duration-300 group-hover:bg-yellow-900 group-hover:scale-105 lg:group-hover:scale-110"
              />
              <div className="relative space-y-12 p-8 md:p-12 lg:p-8 xl:p-12">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 flex justify-center items-center rounded-full bg-yellow-100"
                >
                  <span className="font-bold text-yellow-700">2</span>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl text-gray-800 font-medium transition group-hover:text-white">
                    Survival skills
                  </h4>
                  <p className="text-gray-600 group-hover:text-yellow-200">
                    The worst could happen at any time and you definitely need
                    to get some primal survival skills.
                  </p>
                </div>
                <Image
                  src="/images/survival.jpg"
                  className="w-16 rounded-full h-16"
                  width={512}
                  height={512}
                  alt="Sound snare survival tips"
                />
              </div>
            </div>
            <div className="relative group">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-xl bg-white shadow-2xl transition duration-300 group-hover:bg-yellow-900 group-hover:scale-105 lg:group-hover:scale-110"
              />
              <div className="relative space-y-12 p-8 md:p-12 lg:p-8 xl:p-12">
                <div
                  aria-hidden="true"
                  className="w-10 h-10 flex justify-center items-center rounded-full bg-yellow-100"
                >
                  <span className="font-bold text-yellow-700">3</span>
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl text-gray-800 font-medium transition group-hover:text-white">
                    Health tips
                  </h4>
                  <p className="text-gray-600 group-hover:text-yellow-200">
                    An apple a day, gets the doctor away. A healthy tip a day,
                    keeps your insurance at bay.
                  </p>
                </div>
                <Image
                  src="/images/health.jpg"
                  className="w-16 rounded-full h-16"
                  width={512}
                  height={512}
                  alt="Sound snare health"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative bg-cover bg-no-repeat bg-center mb-8"
        style={{
          minHeight: 400,
          backgroundImage:
            'url("https://images.unsplash.com/photo-1571984405176-5958bd9ac31d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auhref=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="flex flex-col justify-center items-center absolute inset-0 bg-black opacity-75 text-center text-white p-10">
          <h2 className="font-serif text-2xl md:text-3xl">
            Interested in Podcasts
          </h2>
          <p>
            Listen to music, to audio blogs and to podcasts saved using your
            spotify account.
          </p>
          <Link
            href="/podcast"
            className="bg-transparent hover:bg-white text-white font-bold hover:text-black py-2 px-4 my-4 border border-white rounded inline-flex items-center"
          >
            <span>Find out more</span>
            <svg
              className="ml-2 w-4 h-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

// Fetch data in build time
export const getStaticProps = async () => {
  const articles = await client.fetch(`*[_type == "post"][0...4] {
    title,
    slug,
    mainImage{
      asset->{ _id, url }
    },
    excerpt,
    _createdAt,
    "name": author->name,
  }`);
  return {
    props: {
      articles,
    },
    revalidate: 1800, // Revalidate every 30 minutes
  };
}

export default Blog;
