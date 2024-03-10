import { NextMeetUser } from '@/template/User';
import NextAuth, { User } from 'next-auth';

declare module 'next-auth' {
    interface User extends NextMeetUser{};

    interface Session {
        user: User,
    }
}