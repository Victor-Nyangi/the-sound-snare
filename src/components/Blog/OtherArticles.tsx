import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { ArticleTypeI } from "../../../types";

type Props = {
  articles: ArticleTypeI[];
};

const OtherArticles = ({ articles }: Props) => {
  return (
    <>
      <section className="relative py-20 2xl:py-40 bg-gray-800 overflow-hidden">
          <div className="container px-4 mx-auto">
            <div className="mb-14 text-center">
              <span className="text-lg text-blue-400 font-bold">
                Similar
              </span>
              <h2 className="mt-8 text-5xl font-bold font-heading text-white">
                Articles
              </h2>
            </div>

            <div className="flex flex-wrap -m-6">
             {(articles ?? []).map((article: ArticleTypeI, index: number) => (
                 <div className="relative w-full lg:w-1/3 p-6" key={index}>
                 <div className="relative z-10 bg-gray-700 rounded-lg">
                   <div className="relative mb-8 h-52">
                     <Image
                       className="w-full h-full rounded-lg object-cover object-top"
                       src={article.mainImage.asset.url}
                       alt={article.title}
                       width={100}
                       height={40}
                     />
                     {/* <div className="absolute bottom-0 left-0 ml-8 mb-6 px-3 pb-3 pt-1 inline-block bg-white rounded-b-2xl border-t-4 border-blue-500">
                       <p className="text-xl font-bold">30</p>
                       <p className="text-xs uppercase text-gray-300">Feb</p>
                     </div> */}
                   </div>
                   <div className="px-14 pb-10">
                     <Link
                       href={`/blogs/articles/${article.slug.current}`}
                       className="inline-block pt-4 text-lg text-green-600 hover:text-gray-100 font-bold border-t border-gray-400"
                     >
                       {article.title}
                     </Link>
                     <p className="mb-3 text-sm font-normal text-gray-100">
                  {article?.excerpt}
                </p>
                   </div>
                 </div>
               </div>
             ))}
            </div>
            {/* <div className="mt-14 lg:mt-24 text-center">
              <a
                className="inline-block py-5 px-12 mr-4 bg-blue-500 hover:bg-blue-600 rounded-full text-white font-bold transition duration-200"
                href="#"
              >
                See all
              </a>
            </div> */}
          </div>
        </section>
    </>
  );
};

export default OtherArticles;
