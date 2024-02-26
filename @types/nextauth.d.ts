import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            userID: number | null
        } & DefaultSession['user'];
    }
}