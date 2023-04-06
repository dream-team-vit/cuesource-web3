import { Avatar, Button, Card, Divider, Text } from "@mantine/core";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "~/utils/api";
import { redirect, truncate } from "~/utils/helper";

export const QuestCard: React.FC<{ quest: any }> = ({ quest }) => {
  // helpers
  const address = useAddress();

  // get repo details (name, link, orgname, orglink) from `quest.repoId`
  const { data: repo, isLoading: isRepoDataLoading } =
    api.github.getRepoDetails.useQuery({ repoId: quest.repoId.toNumber() });

  // get issue details (number, title,) from `quest.issueId`
  const { data: issue, isLoading: isIssueDataLoading } =
    api.github.getIssueDetails.useQuery({
      repoId: quest.repoId.toNumber(),
      issueNumber: quest.issueNumber.toNumber(),
    });

  useEffect(() => {
    console.log(repo);
  }, [isRepoDataLoading]);

  if (isRepoDataLoading || isIssueDataLoading || !quest) return null;
  return (
    <Card
      className="flex w-5/6 flex-col items-start justify-center gap-5"
      withBorder
      shadow="md"
    >
      {/* top section */}
      <div className="flex w-full items-center justify-between">
        {/* OrgName/RepoName */}
        <div className="flex items-center gap-2">
          <Avatar size="sm" src={repo.owner.avatar_url} />

          <Text className="link" onClick={() => redirect(repo.owner.html_url)}>
            {repo.owner.login}
          </Text>
          <Text size="xl">/</Text>
          <Text onClick={() => redirect(repo.html_url)} className="link">
            {repo.name}
          </Text>
        </div>

        {/* Owner Address */}
        <Text
          className="link text-gray-400"
          onClick={() =>
            redirect(`https://etherscan.io/address/${quest.owner}`)
          }
        >
          {(quest.owner as string).slice(0, 7)}...
          {(quest.owner as string).slice(-3)}
          {address && quest.owner === address && " (You)"}
        </Text>
      </div>

      {/* middle section ~ a.k.a issue detail section */}
      <div className="w-full">
        <Text className="text-gray-400">#{issue.number}</Text>
        <Text
          className="link mb-2 text-lg font-bold"
          onClick={() => redirect(issue.html_url)}
        >
          {issue.title}
        </Text>
        <Text className="flex-wrap text-sm text-gray-400">
          <ReactMarkdown>{`${truncate(issue.body, 100)}...`}</ReactMarkdown>
        </Text>
      </div>

      <Divider
        label="Quest Description"
        labelPosition="center"
        className="w-full"
      />

      {/* Quest Description */}
      <div className="flex w-full items-center justify-evenly gap-2">
        {/* description */}
        <div>
          <Text size="sm" mb="xs" className="text-gray-400">
            Description
          </Text>
          <Text className="max-w-lg flex-wrap">
            {truncate(quest.description, 100)}...
          </Text>
        </div>

        <Divider orientation="vertical" />

        {/* bid pay-range */}
        <div>
          <Text size="sm" mb="xs" className="text-gray-400">
            Pay Range
          </Text>
          <Text>
            {quest.minPrize.toNumber()}ETH - {quest.maxPrize.toNumber()}ETH
          </Text>
        </div>

        <Divider orientation="vertical" />

        {/* number of bids */}
        <div>
          <Text size="sm" mb="xs" className="text-gray-400">
            Bids (now)
          </Text>
          <Text>{quest.bids.length}</Text>
        </div>

        <Divider orientation="vertical" />

        {/* know more */}
        <div>
          <Text size="sm" mb="xs" className="text-gray-400">
            Know more...
          </Text>
          <Button variant="outline" color="indigo">
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};
