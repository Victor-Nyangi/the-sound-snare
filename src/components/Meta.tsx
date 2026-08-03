import Head from "next/head";

interface Props {
  title?: string;
  keywords?: string;
  description?: string;
}

// Default parameters rather than `Meta.defaultProps`: React 19 removed
// defaultProps support for function components, which silently left every
// page with an empty <title> and no meta description.
const Meta = ({
  title = "Sound Snare blog",
  keywords = "blog, health, podcast",
  description = "A simple blog addressing health, relationships, religion and life.",
}: Props) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  );
};

export default Meta;
