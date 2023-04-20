import { Octokit } from "@octokit/rest";
import { type Session } from "next-auth";
import { prisma } from "~/server/db";

export async function createOctokit({ session }: { session: Session }) {
  const access_token = (
    await prisma.account.findFirst({ where: { userId: session.user.id } })
  )?.token!;

  return new Octokit({
    auth: access_token,
  });
}
