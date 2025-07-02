import NextAuth from "next-auth";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

import { accounts, sessions, users, verificationTokens } from "@/db/schema";
import { getUserById, updateUserById } from "@/server/db/users";
import providers from "./providers";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  events: {
    async linkAccount({ user }) {
      await updateUserById(user.id!, {
        emailVerified: new Date(),
      });
    },
    signIn: async ({ account, user }) => {
      if (account?.type !== "credentials") {
        await updateUserById(user.id!, {
          emailVerified: new Date(),
          isOauth: true,
        });
      }
    },
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id!);
      if (!existingUser?.emailVerified) {
        return false;
      }
      return true;
    },
    async jwt({ token }) {
      const userExists = await getUserById(token.sub ?? (token.id as string));
      if (!userExists) return token;

      const user = await getUserById(token.sub ?? (token.id as string));

      return {
        id: user?.id,
        name: user?.name,
        isOauth: user?.isOauth,
        image: user?.image,
        email: user?.email,
        gems: user?.gems,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.image = token.image as string;
        session.user.id = token.id as string;
        session.user.isOauth = token.isOauth as boolean;
        session.user.name = token.name as string;
        session.user.gems = token.gems as number;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },

  ...providers,
});
