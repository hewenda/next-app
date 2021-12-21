import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";

import useAdmin from "hooks/useAdmin";

const Home: NextPage = () => {
  const [isLogin] = useAdmin();

  return (
    <div>
      <Head>
        <title>Next auth client</title>
      </Head>
      <div className="container mx-auto py-4">
        {isLogin && (
          <div className="border border-gray-100 p-4">
            <p className="text-cyan-600">You are login</p>
            <button
              onClick={() => signOut()}
              className="mt-2 bg-cyan-500 shadow-lg shadow-cyan-500/50 text-white px-2 leading-8 rounded"
            >
              signOut
            </button>
          </div>
        )}
        {!isLogin && (
          <div className="border border-gray-100 p-4">
            <p className="text-cyan-600">You are not login</p>
            <button
              onClick={() => signIn('github')}
              className="mt-2 bg-cyan-500 shadow-lg shadow-cyan-500/50 text-white px-2 leading-8 rounded"
            >
              signIn
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
