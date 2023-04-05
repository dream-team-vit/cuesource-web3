import { Octokit } from "@octokit/rest";
import { type Session } from "next-auth";
import { prisma } from "~/server/db";

import { createAppAuth, createOAuthUserAuth } from "@octokit/auth-app";
import { readFileSync } from "fs";

export async function createOctokit({ session }: { session: Session }) {
  const access_token = (
    await prisma.account.findFirst({ where: { userId: session.user.id } })
  )?.token!;

  console.log(access_token);

  return new Octokit({
    auth: access_token,
  });
}
