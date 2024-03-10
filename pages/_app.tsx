import "@/styles/globals.css";
import type { AppProps } from "next/app";
import RootLayout from "./layout";
import { RecoilRoot } from "recoil";
import AuthProvider from "@/lib/auth/SessionProvider";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
export default function App({ Component,pageProps: { session, ...pageProps },}: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Header/>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}
