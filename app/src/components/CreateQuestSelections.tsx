import {
  Badge,
  Button,
  Container,
  Group,
  Select,
  SelectItem,
  Text,
  Title,
} from "@mantine/core";
import { inferProcedureOutput } from "@trpc/server";
import { forwardRef, useEffect, useState } from "react";
import { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { CreateQuestModal } from "./CreateQuestModal";
import { useAddress } from "@thirdweb-dev/react";

export default function CreateQuestSelections() {
  const address = useAddress();

  // ORG
  const { data: listOfUserOrgs, isFetched } = api.github.getUserOrgs.useQuery();
  const [orgSelectionData, setOrgSelectionData] = useState<SelectItem[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // REPOS
  const getReposOfOrg = api.github.getReposOfOrg.useMutation();
  const [repos, setRepos] =
    useState<inferProcedureOutput<AppRouter["github"]["getReposOfOrg"]>>();
  const [repoSelectionData, setRepoSelectionData] = useState<SelectItem[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);

  // Issue
  const getIssuesOfRepo = api.github.getIssuesOfRepo.useMutation();
  const [issues, setIssues] =
    useState<inferProcedureOutput<AppRouter["github"]["getIssuesOfRepo"]>>();
  const [issueSelectionData, setIssueSelectionData] = useState<SelectItem[]>(
    []
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const [showCreateDetailModal, setShowCreateDetailModal] = useState(false);

  const nullifySelection = () => {
    setSelectedOrgId(null);
    setSelectedRepoId(null);
    setSelectedIssueId(null);
  };

  // Organization Data Filling
  useEffect(() => {
    isFetched &&
      setOrgSelectionData(
        listOfUserOrgs!.map(
          (org) =>
            ({ value: org.id.toString(), label: org.login } as SelectItem)
        )
      );
  }, [isFetched]);

  // Repo Selection Data FIlling
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

  // Issue Selection Data Filling
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

        setIssues(issues);

        // set it to selectedReposData
        issues &&
          setIssueSelectionData(
            issues.map(
              (issue) =>
                ({
                  value: issue.id.toString(),
                  label: `[#${issue.number}] ${issue.title}`,
                  description: issue.id,
                } as SelectItem)
            )
          );
      })();
    }
  }, [selectedRepoId]);

  interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
    image: string;
    label: string;
    description: string;
  }

  const IssueSelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
      <div key={image} ref={ref} {...others}>
        <Text size="sm">{label}</Text>
        <Group>
          {issues
            ?.filter((issue) => issue.id === parseInt(description))[0]
            ?.labels.map((label) => (
              <Badge mt="xs" ml="sm">
                {(label as { name: string }).name!}
              </Badge>
            ))}
        </Group>
      </div>
    )
  );

  return (
    <div
      style={{
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Title order={2} mb="sm" style={{ textAlign: "center" }}>
        Create Quest
      </Title>
      <Container
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          border: "0.1px solid gray",
          borderRadius: "10px",
          gap: theme.spacing.md,
        })}
        px="sm"
        py="md"
      >
        <Select
          label="Organization"
          data={orgSelectionData}
          value={selectedOrgId}
          onChange={setSelectedOrgId}
          mr="sm"
          style={{ width: "full" }}
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
          itemComponent={IssueSelectItem}
        />

        <Button
          onClick={() => setShowCreateDetailModal(true)}
          mt="xl"
          variant="outline"
          color="red"
          disabled={!address}
        >
          Create
        </Button>

        <CreateQuestModal
          opened={showCreateDetailModal}
          onClose={() => {
            setShowCreateDetailModal(false);
            nullifySelection();
          }}
          _issueId={parseInt(selectedIssueId!)}
          _repoId={parseInt(selectedRepoId!)}
        />
      </Container>
    </div>
  );
}
