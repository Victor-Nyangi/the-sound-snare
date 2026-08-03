import SEO, { type SEOProps } from "./SEO";

type Props = SEOProps & {
  children?: React.ReactNode;
};

// Renders site-wide defaults. Pages with their own <SEO> (e.g. articles)
// render it inside their body, where next/head's dedupe lets the more
// specific tags win.
const Layout = ({ children, ...seo }: Props) => {
  return (
    <>
      <SEO {...seo} />
      {children}
    </>
  );
};

export default Layout;
