import React from "react";
import Image from "next/image";
import Link from "next/link";
import MusicBg from "/public/images/music.jpg";
import SpotifyIcon from "/public/images/spotify-icon.png";

const PodcastPage = () => {
  return (
    <>
      <div className="bg-black h-screen sm:grid sm:grid-cols-3 ">
        <section className="relative bg-white sm:col-span-2">
          <Image
            className="absolute bg-center inset-0 object-[75%] sm:object-[25%] object-cover w-full h-full opacity-100 sm:opacity-100"
            src={MusicBg}
            alt="The thoughts I have, the music I hear."
          />
          <div className="hidden sm:block sm:inset-0 sm:absolute"></div>

          <div className="relative max-w-screen-xl px-4 mx-auto lg:h-56 lg:items-center">
            <header className="text-white body-font">
              <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link
                  href="/"
                  className="flex title-font font-medium items-center text-white mb-4 md:mb-0"
                >
                  <span className="ml-3 text-xl">Home</span>
                </Link>
                <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                  <Link
                    href="/quotes"
                    className="mr-5 hover:text-gray-300"
                  >
                    Quotes
                  </Link>
                  <Link
                    href="/blogs/category/survival-skills"
                    className="mr-5 hover:text-gray-300"
                  >
                    Survival skills
                  </Link>
                  <Link
                    href="/blogs/category/nutrition"
                    className="mr-5 hover:text-gray-300"
                  >
                    Nutrition
                  </Link>
                  <Link
                    href="/blogs/category/health"
                    className="mr-5 hover:text-gray-300"
                  >
                    Health
                  </Link>
                  <Link
                    href="/blogs/category/general-life"
                    className="mr-5 hover:text-gray-300"
                  >
                    General
                  </Link>
                  <Link
                    href="/blogs/category/religion"
                    className="mr-5 hover:text-gray-300"
                  >
                    Religion
                  </Link>
                </nav>
                <Link href="/podcast" className="mr-5 hover:text-gray-300">
                  Podcast
                </Link>
              </div>
            </header>
          </div>
        </section>
        <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full sm:mx-10 sm:col-span-1 sm:my-auto md:px-24 lg:px-8 lg:py-20 bg-white">
          <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
            <div className="flex flex-col mb-16 sm:text-center sm:mb-0">
              <div className="mb-6 sm:mx-auto">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50">
                  <Image src={SpotifyIcon} alt="Sound Snare spotify" />
                </div>
              </div>
              <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
                  <span className="relative inline-block">
                    <span className="relative">Spotify</span>
                  </span>{" "}
                  Audio and Podcasts
                </h2>
                <p className="text-base text-gray-700 md:text-lg">
                  To access the podcasts, please login to your spotify account
                </p>
              </div>
              <div>
                <button className="nimate-pulse inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white bg-black hover:bg-white hover:text-black transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PodcastPage;
