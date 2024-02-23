import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
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
    
    // async session ({session, token, user} : {session: any, token: any, user: any}) {

    //   console.log('session token:',token);
    //   return await session;
    // },
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        userID: { label: "userID", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        // console.log(credentials?.userID);
        // console.log(credentials?.password);
        if (!credentials) return;
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userID: credentials.userID,
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
});

export default handler;
