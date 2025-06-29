import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { ArticleTypeI } from "../../../types";

type Props = {
  articles: ArticleTypeI[];
};

const LatestArticles = ({ articles }: Props) => {
  return (
    <>
      <section className="px-4 py-10 mx-auto max-w-7xl bg-black">
        <h2 className="pb-8 mb-12 text-2xl font-extrabold leading-tight text-gray-100 border-b border-gray-200 md:text-4xl">
          Latest Articles
        </h2>

        <div className="flex flex-col space-y-16">
          {(articles ?? []).map((post: ArticleTypeI, index: number) => (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4" key={index}>
              <Image
                src={post.mainImage.asset.url}
                width={100}
                height={40}
                unoptimized
                className="object-cover rounded w-full h-40 col-span-1 bg-center"
                alt="Blogs"
                loading="lazy"
              />
              <div className="col-span-1 md:col-span-3">
                <p className="mb-2 -mt-1 text-sm font-normal text-gray-300">
                  {moment(post._createdAt).format("dddd, MMMM Do YYYY")}
                </p>
                <h2 className="mb-2 text-xl font-extrabold leading-snug text-gray-200">
                  <Link
                    href={post.slug.current}
                    className="text-purple-400 hover:text-purple-700"
                  >
                    {post && post?.title}
                  </Link>
                </h2>
                <p className="mb-3 text-sm font-normal text-gray-100">
                  {post && post?.excerpt}
                </p>
                <Link href={`blogs/articles/${post.slug.current}`} className="btn btn-light btn-sm">
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default LatestArticles;
