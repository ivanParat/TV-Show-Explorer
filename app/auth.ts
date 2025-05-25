//NextAuth konfiguracija

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db";
import { populateCookiesWithFavoritesFromDB } from "./lib/cookies-db-sync";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub], //jedino se može logirati preko github računa
  callbacks: {
    async signIn({ user }) {
      if (user.id) {
        await populateCookiesWithFavoritesFromDB(user.id); //kada se korisnik logira, iz baze se dohvaćaju favoriti, koji se spremaju u cookies, iz kojih stranica čita, i u koje upisuje, informacije o favoritima
      }
      return true; 
    },

    async session({ session }) {
      return session; 
    },
  },
});
