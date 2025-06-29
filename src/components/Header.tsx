import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

type Props = {
  path: StaticImageData;
  color?: string;
};

const Header = ({ path, color }: Props) => {
  return (
    <>
      <section className="relative bg-white py-20 sm:pt-10">
        <Image
          className="absolute bg-center inset-0 object-[75%] sm:object-[25%] object-cover w-full h-full opacity-100 sm:opacity-100"
          src={path}
          width={500}
          height={100}
          unoptimized
          alt="The thoughts I have, the music I hear."
        />
        <div className="hidden sm:block sm:inset-0 sm:absolute"></div>

        <div className="relative max-w-screen-xl px-4 mx-auto lg:h-56 lg:items-center">
          <header className="text-white body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
              <Link
                href="/"
                className={`flex title-font font-medium items-center text-${color} hover:text-green-600 mb-4 md:mb-0`}
              >
                <span className="ml-3 text-xl">Home</span>
              </Link>
              <nav
                className={`md:ml-auto md:mr-auto flex flex-wrap items-center text-${color} justify-center`}
              >
                <Link href="/quotes" className="mr-5 hover:text-blue-600">
                  Quotes
                </Link>
                <Link
                  href="/blogs/category/survival-skills"
                  className="mr-5 hover:text-blue-600"
                >
                  Survival skills
                </Link>
                <Link
                  href="/blogs/category/nutrition"
                  className="mr-5 hover:text-blue-600"
                >
                  Nutrition
                </Link>
                <Link href="/blogs/category/health" className="mr-5 hover:text-blue-600">
                  Health
                </Link>
                <Link
                  href="/blogs/category/general-life"
                  className="mr-5 hover:text-blue-600"
                >
                  General
                </Link>
                <Link
                  href="/blogs/category/religion"
                  className="mr-5 hover:text-blue-600"
                >
                  Religion
                </Link>
              </nav>
              <Link
                href="/podcast"
                className={`mr-5 text-${color} hover:text-blue-600`}
              >
                Podcast
              </Link>
              <Link
                href="/about"
                className={`mr-5 text-${color} hover:text-blue-600`}
              >
                About
              </Link>
            </div>
          </header>
        </div>
      </section>
    </>
  );
};


export default Header;
