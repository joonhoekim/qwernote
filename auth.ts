// @/auth.ts
// - extracted from route.ts.
// reference: https://next-auth.js.org/configuration/nextjs

import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from "next";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// NextAuth의 타입을 확장하여 커스텀 필드를 추가
declare module "next-auth/jwt" {
  interface JWT {
    // 추가하고 싶은 커스텀 필드들을 여기에 선언
    id: string;
  }
}

// 세션 타입도 확장
declare module "next-auth" {
  interface Session {
    user: {
      // 추가하고 싶은 커스텀 필드들을 여기에 선언
      // id, email, name, image, role, level, lastLoginAt 등... 필요에 따라 추가
      id?: string;
    };
  }
}

export const config = {
  debug: !!process.env.AUTH_DEBUG,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    // "Callbacks are asynchronous functions you can use to control what happens when an action is performed."
    // "You can specify a handler for any of the callbacks below."

    async jwt({ token, user, account, profile }) {
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });
        if (dbUser.id) {
          token.id = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  events: {
    // "Events are asynchronous functions that do not return a response, they are useful for audit logging, analytics or syncing user data."
    // "The events are useful to integrate with other systems (e.g. mail systems, CRM, etc.)"
  },
  pages: {
    // signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  }
} satisfies NextAuthOptions;

// 아래 handler를 직접 export 했었으나, config를 route.ts 에서 받아서 사용하도록 변경함
// export const { handler } = NextAuth(config);

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
