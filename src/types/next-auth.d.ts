import { DefaultSession } from "next-auth";

export type UserRole = "ADMIN" | "USER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    role: UserRole;
  }
}
