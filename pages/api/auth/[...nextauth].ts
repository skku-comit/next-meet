import NextAuth from "next-auth/next";
import { User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
const NEXTAUTH_SECRET = "examplenextauthsecretfornextmeetproject";
const NEXTAUTH_URL = "http://localhost:3000";

const handler = NextAuth({
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      
      console.log("This is signin function");
      console.log(user);
      console.log(account);
      const res = await fetch(`${NEXTAUTH_URL}/api/signinG`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },      
        body: JSON.stringify({ email: user.email, userName: user.name }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data) {
          if (data.isNew) {
            console.log(`User ${user.name} signed up successfully`);
          } else {
            console.log(`User ${user.name} has just signed in`);
          }
          return true;  
        } else {
          throw new Error("Failed to form json");
        }
      } else {
        console.log(res.status);
        return false;
      }
    },
    async redirect({ url, baseUrl }) { 
      // Allows relative callback URLs
      // console.log(`url: ${url}, baseurl: ${url == baseUrl ? baseUrl : url}`);
      return url == baseUrl ? baseUrl : url;
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same originpm
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
     },
    async jwt({ token, account, profile, user }) {
      // console.log("This is jwt");
      // console.log(token);
      // console.log(account);
      // console.log(profile);
      user && (token.user = user);
      return token;
    },
    async session ({session, token, user }) {
      console.log("This is session");
      // console.log(`${Date.now()}`);
      // if(token && token.user){
      //   session.user = token.user;
      //   return session;
      // }

      const getUserInfo = await fetch(`${NEXTAUTH_URL}/api/userInfo`, {
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
          console.log(credentials);
          console.log(req);
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
          const user = await res.json();
          if (user) {
            // return user;
            return {
              ...user,
              name: user.userName,
            };
          }
          else {
            throw new Error("Failed to form json");
          }
          // return { 
          //   ...user, 
          //   name: user.userName,
          // };
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
