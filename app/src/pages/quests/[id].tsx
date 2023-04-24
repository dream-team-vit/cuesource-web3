import { Avatar, Badge, Card, Divider, Text, Title } from "@mantine/core";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Wrapper } from "~/components/Wrapper";
import { api } from "~/utils/api";
import { contractAddress } from "~/utils/contract";
import { redirect } from "~/utils/helper";

export default function QuestDetailsPage() {
  // helpers

  // loading quest details
  const { id } = useRouter().query;
  const _questId = parseInt(id as string);

  const { contract } = useContract(contractAddress);
  const {
    data: quest,
    status: questDataStatus,
    error,
  } = useContractRead(contract, "getQuest", [_questId]);

  const [repo, setRepo] = useState<any>();
  const [issue, setIssue] = useState<any>();

  useEffect(() => {
    if (questDataStatus == "success") {
      //   loading issue details
      const { data: repoData, status: repoDataStatus } =
        api.github.getRepoDetails.useQuery({ repoId: quest.repoId.toNumber() });

      if (repoDataStatus === "success") {
        setRepo(repoData);
      }
    }
  }, [questDataStatus]);

  useEffect(() => {
    if (repo) {
      //   get issue details (number, title,) from `quest.issueId`
      const { data: issueData, status: issueDataStatus } =
        api.github.getIssueDetails.useQuery({
          repoId: quest.repoId.toNumber(),
          issueNumber: quest.issueNumber.toNumber(),
        });

      if (issueDataStatus === "success") setIssue(issueData);
    }
  }, [repo]);

  if (!repo || !issue || !quest || error) return null;

  return (
    <Wrapper>
      <div className="flex w-full gap-2 p-5">
        {/* left: github issue details */}
        <Card withBorder className="flex flex-[0.2] flex-col gap-2">
          {/* labels */}
          <div>
            <Text mb="xs" size="sm">
              Labels
            </Text>
            <div className="flex flex-wrap gap-1">
              {issue.labels.map((label: any) => (
                <Badge
                  aria-details={label.description}
                  color={`#{issue.color}`}
                  key={label.id}
                  size="xs"
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          </div>
          <Divider my="xs" />
          {/* Author */}
          <div>
            <Text mb="xs" size="sm">
              Author
            </Text>
            <div className="flex gap-2">
              <Avatar size="sm" src={issue.user.avatar_url} />
              <Text
                className="link"
                onClick={() => redirect(issue.user.html_url)}
              >
                @{issue.user.login}
              </Text>
            </div>
          </div>
          <Divider my="xs" />
        </Card>
        {/* middle: github Issue Body & Bids */}
        <Card withBorder className="flex-[0.6]">
          Issue
        </Card>
        {/* right: quest Details */}
        <Card withBorder className="flex-[0.2]">
          Quest
        </Card>
      </div>
    </Wrapper>
  );
}
