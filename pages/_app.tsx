import "@/styles/globals.css";
import type { AppProps } from "next/app";
import RootLayout from "./layout";
import { RecoilRoot } from "recoil";
import AuthProvider from "@/lib/auth/SessionProvider";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AuthProvider>
      <Component {...pageProps} />
      </AuthProvider>
    </RecoilRoot>
  );
}
