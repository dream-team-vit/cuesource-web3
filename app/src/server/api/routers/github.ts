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

  // get repo details from repo number
  getRepoDetails: protectedProcedure
    .input(z.object({ repoId: z.number() }))
    .query(async ({ ctx, input }) => {
      // nedded props html_url, name,
      const repo = (
        await ctx.octokit.request("GET /repositories/:id", {
          id: input.repoId,
        })
      ).data;

      // TODO: return only the useful data

      return repo;
    }),

  getIssueDetails: protectedProcedure
    .input(z.object({ issueNumber: z.number(), repoId: z.number() }))
    .query(async ({ ctx, input }) => {
      const issue = (
        await ctx.octokit.request("GET /repositories/:id/issues/:num", {
          id: input.repoId,
          num: input.issueNumber,
        })
      ).data;

      return issue;
    }),
});
