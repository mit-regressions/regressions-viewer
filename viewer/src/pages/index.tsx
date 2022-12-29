import { type NextPage } from "next";
import Head from "next/head";
import { useRef, useEffect } from "react";


import Player from '../components/Player'

import videojs from 'video.js';
// import 'video.js/dist/video-js.css';
import 'videojs-youtube'

import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import React from "react";

const Home: NextPage = () => {

  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const videoJsOptions = {
    techOrder: ['youtube'],
    autoplay: false,
    controls: true,
    sources: [
      {
        src: 'https://www.youtube.com/watch?v=mToftr444Pc',
        type: 'video/youtube',
      },
    ],
  }
  return (
    <>
      <Head>
        <title>viewer</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-1xl font-extrabold tracking-tight text-white sm:text-[3rem]">
            viewer
          </h1>


          <Player {...videoJsOptions} />
          <div className="flex flex-col items-center justify-center gap-4">
          </div>


          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};