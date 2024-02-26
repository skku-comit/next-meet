import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
const NEXTAUTH_SECRET = "examplenextauthsecretfornextmeetproject";
const NEXTAUTH_URL = "http://localhost:3000";

const handler = NextAuth({
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (user.message != 0) {
        throw new Error(user.message + "");
      }
      return true;
    },
    async redirect({ url, baseUrl }) { return baseUrl },
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session ({session, token }) {
      session.user = token.user;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      // clientId: process.env.GOOGLE_CLIENT_ID || "",
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      clientId:'961303261034-dk8qjjmbsi381540bpkn3pm975slb9qv.apps.googleusercontent.com',
      clientSecret:'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',
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        loginID: { label: "loginID", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials) return;
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loginID: credentials.loginID,
              password: credentials.password,
            }),
          });
          const user = await res.json();
          return { 
            ...user, 
            name: user.userName,
          };
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
  //   secret:process.env.NEXTAUTH_SECRET
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  debug:true
});

export default handler;
