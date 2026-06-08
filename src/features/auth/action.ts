"use server";

import { signIn } from "@/lib/auth";

export async function loginAction(username: string, password: string, remember?: boolean) {
  return signIn("credentials", {
    username,
    password,
    remember,
    redirect: false,
  });
}
