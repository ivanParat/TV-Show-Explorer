import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db";
import { populateCookiesWithFavoritesFromDB } from "./lib/cookies-db-sync";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub],
  callbacks: {
    async signIn({ user }) {
      if (user.id) {
        await populateCookiesWithFavoritesFromDB(user.id);
      }
      return true; 
    },

    async session({ session }) {
      return session; 
    },
  },
});
