import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
const NEXTAUTH_SECRET = "examplenextauthsecretfornextmeetproject";
const NEXTAUTH_URL = "http://localhost:3000";

const handler = NextAuth({
    providers: [
      CredentialsProvider({
        name: "credentials",
        credentials: {},
        async authorize(credentials, req) {
          const user = { id: "1" };
          return user;
        },
      }),
    ],
    session:{
        strategy:'jwt'
    },
    //   secret:process.env.NEXTAUTH_SECRET
    secret: NEXTAUTH_SECRET,
    pages: {
      signIn: "/",
    },
  });

  export {handler as GET, handler as POST}