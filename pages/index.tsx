import React from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { signIn, signOut } from "next-auth/react";
import { css } from "@emotion/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat } from "@fortawesome/free-solid-svg-icons";
import router from "next/router";

import useAdmin from "hooks/useAdmin";

const TypeLine = dynamic(() => import("components/typeit"), { ssr: false });

const Home: NextPage = () => {
  const [isLogin] = useAdmin();

  const clashClick = () => {
    if (isLogin) {
      router.push("/clash");
    } else {
      signIn();
    }
  };

  return (
    <div>
      <Head>
        <title>Next auth client</title>
      </Head>

      <div className="flex items-center justify-center w-screen h-screen relative bg-black">
        <FontAwesomeIcon
          className="absolute right-5 top-5 cursor-pointer"
          icon={faCat}
          onClick={clashClick}
        />
        <TypeLine
          className={css`
            font-size: 24px;
            background: linear-gradient(to right, #efeefd, #24adeb, #deeefe);
            background-clip: text;
            color: transparent;
          `}
        />
      </div>
    </div>
  );
};

export default Home;
