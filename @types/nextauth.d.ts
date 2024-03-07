import NextAuth, { DefaultSession, User } from 'next-auth';
import { NextMeetUserG } from "@/template/User";

declare module 'next-auth' {
    interface Session {
        user: {
            
        } & User;
    }

    interface User extends NextMeetUserG { };
}