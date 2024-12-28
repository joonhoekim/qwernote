// @/auth.ts
// - extracted from route.ts.
// reference: https://next-auth.js.org/configuration/nextjs

import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions, Account, Profile, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  debug: !!process.env.AUTH_DEBUG,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // "Callbacks are asynchronous functions you can use to control what happens when an action is performed."
    // "You can specify a handler for any of the callbacks below."
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
  },
};
export const { handler } = NextAuth(authOptions);
export const { auth, signIn, signOut } = handler;
