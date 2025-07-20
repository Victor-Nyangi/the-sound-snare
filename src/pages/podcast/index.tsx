import React from "react";
import Image from "next/image";
import Link from "next/link";
import MusicBg from "/public/images/music.jpg";
import SpotifyIcon from "/public/images/spotify-icon.png";
import { getPodcasts, getYouTubeChannels } from "../../lib/sanity";

export async function getStaticProps() {
  const podcasts = await getPodcasts();
  const youtubeChannels = await getYouTubeChannels();
  return { props: { podcasts, youtubeChannels } };
}

type Episode = {
  title: string;
  description: string;
  audioUrl?: string;
  spotifyUrl?: string;
};

type Podcast = {
  _id: string;
  title: string;
  description: string;
  spotifyUrl: string;
  coverImage?: { asset?: { url?: string } };
  episodes?: Episode[];
};

type YouTubeChannel = {
  _id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  thumbnail?: { asset?: { url?: string } };
};

type PodcastPageProps = {
  podcasts: Podcast[];
  youtubeChannels: YouTubeChannel[];
};

const PodcastPage = ({ podcasts, youtubeChannels }: PodcastPageProps) => {
  return (
    <>
      <div className="bg-black min-h-screen sm:grid sm:grid-cols-3 ">
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
                  <Link href="/quotes" className="mr-5 hover:text-gray-300">
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
            <div className="flex flex-col mb-8 sm:text-center sm:mb-0">
              <div className="mb-6 sm:mx-auto">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50">
                  <Image src={SpotifyIcon} alt="Sound Snare spotify" />
                </div>
              </div>
              <div className="max-w-xl mb-6 md:mx-auto sm:text-center lg:max-w-2xl md:mb-8">
                <h2 className="max-w-lg mb-4 font-sans text-2xl font-bold leading-none tracking-tight text-gray-900 sm:text-3xl md:mx-auto">
                  <span className="relative inline-block">
                    <span className="relative">Spotify</span>
                  </span>{" "}
                  Podcasts
                </h2>
                <ul className="space-y-4">
                  {podcasts && podcasts.length > 0 ? (
                    podcasts.map((podcast: Podcast) => (
                      <li key={podcast._id} className="border-b pb-2">
                        {podcast.coverImage?.asset?.url && (
                          <img
                            src={podcast.coverImage.asset.url}
                            alt={podcast.title}
                            width={80}
                            className="mb-2 rounded"
                          />
                        )}
                        <div className="font-semibold">{podcast.title}</div>
                        <div className="text-sm text-gray-700 mb-1">
                          {podcast.description}
                        </div>
                        <a
                          href={podcast.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Listen on Spotify
                        </a>
                        {podcast.episodes && podcast.episodes.length > 0 && (
                          <ul className="ml-4 mt-2 space-y-1">
                            {podcast.episodes.map(
                              (ep: Episode, idx: number) => (
                                <li key={idx}>
                                  <span className="font-medium">
                                    {ep.title}
                                  </span>
                                  : {ep.description}{" "}
                                  {ep.spotifyUrl && (
                                    <a
                                      href={ep.spotifyUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-green-600 hover:underline ml-1"
                                    >
                                      Spotify
                                    </a>
                                  )}
                                  {ep.audioUrl && (
                                    <a
                                      href={ep.audioUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-600 hover:underline ml-1"
                                    >
                                      Audio
                                    </a>
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </li>
                    ))
                  ) : (
                    <li>No podcasts found.</li>
                  )}
                </ul>
              </div>
              <div className="max-w-xl mb-6 md:mx-auto sm:text-center lg:max-w-2xl md:mb-8">
                <h2 className="max-w-lg mb-4 font-sans text-2xl font-bold leading-none tracking-tight text-gray-900 sm:text-3xl md:mx-auto">
                  <span className="relative inline-block">
                    <span className="relative">YouTube</span>
                  </span>{" "}
                  Channels
                </h2>
                <ul className="space-y-4">
                  {youtubeChannels && youtubeChannels.length > 0 ? (
                    youtubeChannels.map((channel: YouTubeChannel) => (
                      <li key={channel._id} className="border-b pb-2">
                        {channel.thumbnail?.asset?.url && (
                          <img
                            src={channel.thumbnail.asset.url}
                            alt={channel.title}
                            width={80}
                            className="mb-2 rounded"
                          />
                        )}
                        <div className="font-semibold">{channel.title}</div>
                        <div className="text-sm text-gray-700 mb-1">
                          {channel.description}
                        </div>
                        <a
                          href={channel.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:underline"
                        >
                          Watch on YouTube
                        </a>
                      </li>
                    ))
                  ) : (
                    <li>No YouTube channels found.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PodcastPage;
