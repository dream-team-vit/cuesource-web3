import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const githubRouter = createTRPCRouter({
  getUserOrgs: protectedProcedure.query(async ({ ctx }) => {
    try {
      const orgs = (await ctx.octokit.orgs.listForAuthenticatedUser()).data;

      return orgs;
    } catch (error) {
      console.error(error);
    }
  }),

  setPersonalAccessToken: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.account.update({
        where: { userId: ctx.session.user.id },
        data: {
          token: input.token,
        },
      });
    }),
  checkPersonalAccessToken: protectedProcedure.query(async ({ ctx }) => {
    return !(
      await ctx.prisma.account.findFirst({
        where: { userId: ctx.session.user.id },
      })
    )?.token?.includes("ghp_");
  }),

  getPersonalAccessToken: protectedProcedure.query(async ({ ctx }) => {
    return (await ctx.prisma.account.findFirst({
      where: { userId: ctx.session.user.id },
    }))!.token;
  }),

  getReposOfOrg: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const reposOfOrg = (
        await ctx.octokit.repos.listForOrg({
          org: input.orgId,
        })
      ).data;

      return reposOfOrg;
    }),

  getIssuesOfRepo: protectedProcedure
    .input(
      z.object({
        repoName: z.string(),
        repoOwner: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const issuesOfRepo = (
        await ctx.octokit.issues.listForRepo({
          repo: input.repoName,
          owner: input.repoOwner,
        })
      ).data;

      return issuesOfRepo;
    }),
});
