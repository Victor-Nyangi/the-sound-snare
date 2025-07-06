import type { ReactElement } from "react";
import Layout from "@/components/Layout";
import NestedLayout from "@/components/NestedLayout";
import type { NextPageWithLayout } from "./_app";
import Header from "@/components/Header";
import Link from "next/link";

const NotFound: NextPageWithLayout = () => {
  return (
    <>
      <Header path="/images/not-found.svg" color="white" />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go back home
        </Link>
      </div>
    </>
  );
};

NotFound.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};

export default NotFound;
