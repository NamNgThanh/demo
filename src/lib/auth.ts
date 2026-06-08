import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.nGUOI_DUNG.findUnique({
            where: {
              TAI_KHOAN: credentials.username as string,
            }
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.MAT_KHAU
          );

          if (!isPasswordValid) {
            return null;
          }

          const userData = {
            id: user.ID_NGUOI_DUNG,
            username: user.TAI_KHOAN,
            role: user.QUYEN,
          };

          return userData;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      const baseToken = await authConfig.callbacks?.jwt?.({ token, user, trigger, session, account: null as any }) || token;

      Object.assign(token, baseToken);

      if (token.sub && !token.employeeId) {
        try {
          const dbUser = await prisma.nGUOI_DUNG.findUnique({
            where: { ID_NGUOI_DUNG: token.sub },
          });

          if (dbUser) {
            token.id = dbUser.ID_NGUOI_DUNG;
            token.username = dbUser.TAI_KHOAN;
            token.role = dbUser.QUYEN;
          }
        } catch (error) {
          console.error("Error refreshing stale token:", error);
        }
      }

      return token;
    },
  },
});
