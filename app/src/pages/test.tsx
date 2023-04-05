import { Select, SelectItem } from "@mantine/core";
import { inferProcedureOutput } from "@trpc/server";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";

export default function TestPage() {
  const session = useSession();
  const { data: listOfUserOrgs, isFetched } = api.github.getUserOrgs.useQuery();

  const [repos, setRepos] =
    useState<inferProcedureOutput<AppRouter["github"]["getReposOfOrg"]>>();
  const [orgSelectionData, setOrgSelectionData] = useState<SelectItem[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const [repoSelectionData, setRepoSelectionData] = useState<SelectItem[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);

  const [issueSelectionData, setIssueSelectionData] = useState<SelectItem[]>(
    []
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const getReposOfOrg = api.github.getReposOfOrg.useMutation();
  const getIssuesOfRepo = api.github.getIssuesOfRepo.useMutation();

  const pATokenMutation = api.github.setPersonalAccessToken.useMutation();
  const { data: isPersonalAccessToken } =
    api.github.checkPersonalAccessToken.useQuery();

  const [pAToken, setPAToken] = useState("");

  const updatePAToken = async () => {
    await pATokenMutation.mutateAsync({ token: pAToken });
  };

  useEffect(() => {
    isFetched &&
      setOrgSelectionData(
        listOfUserOrgs!.map(
          (org) =>
            ({ value: org.id.toString(), label: org.login } as SelectItem)
        )
      );
  }, [isFetched]);

  useEffect(() => {
    if (selectedOrgId) {
      (async () => {
        // fetch data using reposForOrg mutation
        const repos = await getReposOfOrg.mutateAsync({
          orgId: selectedOrgId,
        });

        // set it to selectedReposData
        if (repos) {
          setRepos(repos);
          setRepoSelectionData(
            repos.map(
              (repo) =>
                ({ value: repo.id.toString(), label: repo.name } as SelectItem)
            )
          );
        }
      })();
    }
  }, [selectedOrgId]);

  useEffect(() => {
    if (selectedRepoId) {
      (async () => {
        const selectedRepo = repos!.filter(
          (repo) => repo.id.toString() == selectedRepoId
        )[0]!;

        // fetch data using reposForOrg mutation
        const issues = await getIssuesOfRepo.mutateAsync({
          repoName: selectedRepo.name,
          repoOwner: selectedRepo.owner.login,
        });

        // set it to selectedReposData
        issues &&
          setIssueSelectionData(
            issues.map(
              (issue) =>
                ({
                  value: issue.id.toString(),
                  label: `[#${issue.number}] ${issue.title}`,
                } as SelectItem)
            )
          );
      })();
    }
  }, [selectedRepoId]);

  return (
    <div>
      <div>
        {session.status === "unauthenticated" ? (
          <button onClick={async () => void (await signIn("github"))}>
            Login
          </button>
        ) : (
          <button onClick={() => signOut()}>Log Out</button>
        )}
      </div>
      {session.data?.user ? (
        <div>
          {isPersonalAccessToken && (
            <div>
              <p>add your personal access token with `read:org` scope.</p>
              <input
                type="text"
                placeholder="personal access token"
                value={pAToken}
                onChange={(e) => setPAToken(e.target.value)}
              />
              <button onClick={updatePAToken}>Add</button>
            </div>
          )}
          <div>
            <Select
              label="Organization"
              data={orgSelectionData}
              value={selectedOrgId}
              onChange={setSelectedOrgId}
            />

            <Select
              label="Repository"
              data={repoSelectionData}
              value={selectedRepoId}
              onChange={setSelectedRepoId}
            />

            <Select
              label="Issue"
              data={issueSelectionData}
              value={selectedIssueId}
              onChange={setSelectedIssueId}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
