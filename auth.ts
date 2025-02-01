// @/auth.ts
// - extracted from route.ts.
// reference: https://next-auth.js.org/configuration/nextjs
import {prisma} from '@/lib/prisma';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next';
import {getServerSession, Session} from 'next-auth';
import type {NextAuthOptions} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {DefaultSession, User} from 'next-auth';
import {JWT} from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            handle: string;
        } & DefaultSession['user'];
    }

    interface User {
        handle: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        handle: string;
    }
}

export const config = {
    debug: !!process.env.AUTH_DEBUG,
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        // "Callbacks are asynchronous functions you can use to control what happens when an action is performed."
        // "You can specify a handler for any of the callbacks below."

        async jwt({token, user, account}): Promise<JWT> {
            if (account && user) {
                // 최초 로그인시에만 실행

                const dbUser = await prisma.user.findUnique({
                    where: {email: user.email!},
                    select: {
                        id: true,
                        handle: true,
                    },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.handle = dbUser.handle;
                }
            }
            console.log('#### TOKEN ####', token);
            return token;
        },

        async session({session, token}): Promise<Session> {
            if (session.user) {
                session.user.id = token.id;
                session.user.handle = token.handle;
                // email, name, image는 기본으로 포함됨
            }
            session.user.id = token.id;
            session.user.handle = token.handle;
            console.log('#### SESSION ####', session);
            return session;
        },
    },
    events: {},
    pages: {},
} satisfies NextAuthOptions;

export async function auth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
): Promise<Session | null> {
    return getServerSession(...args, config);
}
