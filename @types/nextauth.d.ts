import { NextMeetUser } from '@/template/User';
import NextAuth, { User } from 'next-auth';

declare module 'next-auth' {
    interface User extends NextMeetUser{};

    declare module 'next-auth' {
        interface Session {
            user?: User;
        }
    }
}