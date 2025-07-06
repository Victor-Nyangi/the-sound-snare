import Image from "next/image";
import Link from "next/link";
import Meta from "@/components/Meta";


export default function Home() {
  return (
    <>
      <Meta />
      <main className="App">
        <section className="relative bg-white">
          <img
            className="absolute inset-0  sm:object-[25%] object-cover w-full h-full sm:opacity-100"
            src="/sound-snare-bg.jpg"
            alt="The thoughts I have, the music I hear."
          />

          <div className="hidden sm:block sm:inset-0 sm:absolute"></div>

          <div className="relative max-w-screen-xl px-4 pt-56 sm:py-32 mx-auto h-screen lg:items-center lg:flex">
            <div className="max-w-xl text-center sm:text-left">
              <h1 className="text-3xl font-extrabold sm:text-5xl pb-2">
                Peace of thought and
              </h1>
              <h2 className="text-2xl font-extrabold sm:text-4xl">
                <strong className="font-extrabold text-gray-400 sm:block">
                  the sound of calm
                </strong>
              </h2>

              <blockquote className="max-w-lg mt-4 sm:leading-relaxed sm:text-xl font-italic text-purple-900">
                Consider the flowers, they don&apos;t try to look right, They
                just open their petals and turn to the light -{" "}
                <cite className="font-bold">Jim Carrey</cite>
              </blockquote>

              <div className="flex flex-wrap gap-4 mt-40 sm:mt-8 justify-between sm:justify-start sm:space-x-6 text-center">
                <Link
                  className="block  px-12 py-3 text-sm font-medium text-white rounded shadow bg-black sm:w-auto active:bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring"
                  href="/podcast"
                >
                  Podcast
                </Link>

                <Link
                  className="block px-12 py-3 text-sm font-medium bg-white rounded shadow text-dark sm:w-auto hover:text-rose-700 active:text-rose-500 focus:outline-none focus:ring"
                  href="/blogs"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
