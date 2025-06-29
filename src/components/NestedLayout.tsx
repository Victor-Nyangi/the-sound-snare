import Footer from "./Footer";
type Props = {
  children?: React.ReactNode;
};

const NestedLayout = ({ children }: Props) => {
  return (
    <>
          {children}
      <Footer />
    </>
  );
};

export default NestedLayout;
