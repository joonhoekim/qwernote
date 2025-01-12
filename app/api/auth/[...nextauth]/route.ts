import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { config } from "@/auth";

export const authOptions: NextAuthOptions = config;
export default NextAuth(config);
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
