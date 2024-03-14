import NextAuth from "next-auth/next";
import { User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextMeetUser } from "@/template/User";
import { checkEnvironment } from "@/lib/functions/checkEnv";
import { NM_CODE } from "@/lib/msg/errorMessage";

const NEXTAUTH_URL = checkEnvironment();

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
    async jwt({ token, account, profile, user, trigger, session }) {
      console.log("This is jwt");
      console.log(token);
      console.log(account);
      console.log(profile);
      console.log(user);
      user && (token.user = user);
      if (trigger === "update" && session.eventIDList) {
        (token.user as NextMeetUser).eventIDList = session.eventIDList
      }
      return token;
    },
    async session ({session, token, user }) {
      console.log("This is session");
      if(token && token.user){
        console.log('token.user: ',token.user)
        
        if(token.user && (token.user as User).id){
          const res2 = await fetch(`${NEXTAUTH_URL}/api/user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              provider: "google",
              userName: (token.user as User).name,
              email : (token.user as User).email,
            }),
          });
          const { message, user } = await res2.json();
          console.log("@@@session@@@ google user logged in", message, user);
          if(user){
            session.user = user;
            return session;
          }
        }
        console.log('token.user: ', token.user);
        (session.user as NextMeetUser) = (token.user as NextMeetUser);
        return session;
      }
      console.log("flag@@@@@@@@@@@@@@")
      const getUserInfo = await fetch(`${NEXTAUTH_URL}/api/user`, {
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
    secret:process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  debug:true
});

export default handler;
