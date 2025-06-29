import type { ReactElement } from "react";
import { server } from '../../config'
import Layout from "@/components/Layout";
import NestedLayout from "@/components/NestedLayout";
import type { NextPageWithLayout } from "./_app";

import Header from "@/components/Header";
import QuotesImg from "/public/images/s5.jpg"

type Props = {
    quotes: string[]
  }

const Quotes: NextPageWithLayout<Props> = ({ quotes }: Props) => {
    //   const [allPostsData, setAllPosts] = useState(null);

//   useEffect(() => {
//     sanityClient
//       .fetch(
//         `*[_type == "post" && categories[0]._ref == '108f053e-69b8-4ef1-bb60-10a69593d15b']{
//         title,
//         slug,
//         body,
//         mainImage{
//           asset->{
//           _id,
//           url
//         }
//       }
//     }`
//       )
//       .then((data) => {
//         // console.log(data[0].body[0].children[0].text)
//         const items = data[0].body[0].children[0].text.split('|');
//         setAllPosts(items);
//       })
//       .catch(console.error);
//   }, []);

  return (
    <>
    <Header path={QuotesImg} color="white"/>
    <section className='m-8'>
    <div>
      <h1 className="text-4xl text-center mb-8 font-semibold">Quotes</h1>
      <div className="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="absolute inset-x-0 top-0 items-center justify-center hidden overflow-hidden md:flex md:inset-y-0">
          <svg
            viewBox="0 0 88 88"
            className="w-full max-w-screen-xl text-gray-800"
          >
            <circle
              fill="currentColor"
              fillOpacity="0.4"
              cx="44"
              cy="44"
              r="15.5"
            />
            <circle
              fillOpacity="0.1"
              fill="currentColor"
              cx="44"
              cy="44"
              r="44"
            />
            <circle
              fillOpacity="0.1"
              fill="currentColor"
              cx="44"
              cy="44"
              r="37.5"
            />
            <circle
              fillOpacity="0.1"
              fill="currentColor"
              cx="44"
              cy="44"
              r="29.5"
            />
            <circle
              fillOpacity="0.1"
              fill="currentColor"
              cx="44"
              cy="44"
              r="22.5"
            />
          </svg>
        </div>
        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {
            (quotes ?? []).map((quote: string, index: number) => (
              <div key={index} className="group px-10 py-20 text-center transition duration-300 transform bg-gray-900 rounded shadow-2xl hover:scale-105 hover:bg-white md:shadow-xl hover:shadow-2xl">
                <p className="font-semibold text-gray-200 group-hover:text-black">
                {quote && quote}
            </p>
          </div>
            ))
          }
        </div>
      </div>
    </div>
    </section>
    </>
  )
}

Quotes.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout>
        <NestedLayout>{page}</NestedLayout>
      </Layout>
    );
  };

  // Fetch data in build time
  export const getStaticProps = async () => {
    const res = await fetch(`${server}/api/quotes`)
    const data = await res.json()
    const quotes = data.quotes[0].body[0].children[0].text.split('|');

    return {
      props: {
        quotes,
      },
    }
  }

export default Quotes