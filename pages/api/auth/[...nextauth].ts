import NextAuth from "next-auth/next";
import { User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getUserInfoByID } from "@/lib/functions/CRUD";
const NEXTAUTH_SECRET = "examplenextauthsecretfornextmeetproject";
const NEXTAUTH_URL = "http://localhost:3000";

const handler = NextAuth({
  callbacks: {

    async redirect({ url, baseUrl }) { 
      // Allows relative callback URLs
      console.log(`url: ${url}, baseurl: ${url == baseUrl ? baseUrl : url}`);
      return url == baseUrl ? baseUrl : url;
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same originpm
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
     },
    async jwt({ token, account, profile, user }) {
      console.log("This is jwt");
      console.log(token);
      console.log(account);
      console.log(profile);
      console.log(user);
      user && (token.user = user);
      return token;
    },
    async session ({session, token, user }) {
      console.log("This is session");
      if(token && token.user){
        console.log(token.user)
        // const userInfo = await getUserInfoByID(+(token.user as User).id);
        // console.log('userInfo: ',userInfo);

        if(token.user && token.user.id){
          const res2 = await fetch(`${NEXTAUTH_URL}/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "google",
              userName: token.user.name,
              loginID : token.user.name,
              email : token.user.email,
              password : ""
            }),
          });
          const {message, user} = await res2.json();

          console.log("login userg", message, user)
          if(message==0 || message == 11){
            session.user = user;
            return session;
          }
         
        }

        session.user = token.user;
        return session;
      }
      const getUserInfo = await fetch(`api/userInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: (token.user as User).email })
      });
      if (getUserInfo.ok) {
        const userInfo = await getUserInfo.json();
        if (userInfo) {
          (session as Session).user = userInfo;
          console.log(session.user);
          return session;
        } else {
          throw new Error("Failed to form json");
        }
      } else {
        throw new Error("Failed to get valid response");
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        loginID: { label: "loginID", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        try {
          if (!credentials) throw new Error("No credentials");
          console.log("This is authorization function")
          console.log("credentials",credentials);
          console.log("req",req);
          const res = await fetch(`${NEXTAUTH_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loginID: credentials.loginID,
              password: credentials.password,
            }),
          });
          const {message, user} = await res.json();

          console.log("login user", user)

          if (message === 0) {
            return user;
          }
          else {
            throw new Error("login failed with errorcode " + message);
          }

        } catch (error) {
          console.log(error);
          return false;
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
