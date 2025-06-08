"use server";

import { cache } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getAuthSession = cache(async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const [authenticated, user] = await Promise.all([
    isAuthenticated(),
    getUser(),
  ]);

  return {
    isAuthenticated: authenticated,
    userId: user?.id ?? null,
  };
});
