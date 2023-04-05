import { Anchor, Box, Button, Container, Grid, Text } from "@mantine/core";
import { useRouter } from "next/router";

export type QuestCardProps = {
  orgName: string;
  issue: {
    title: string;
    description: string;
    link: string;
  };

  deadlineDayCount: number;
  minPrize: number;
  maxPrize: number;
  repo: {
    link: string;
    name: string;
  };
};

export default function QuestCard({
  orgName,
  issue,
  deadlineDayCount,
  minPrize,
  maxPrize,
  repo,
}: QuestCardProps) {
  const router = useRouter();

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        textAlign: "center",
        padding: theme.spacing.xl,
        borderRadius: theme.radius.xl,
        cursor: "pointer",
        width: "content",

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        },
      })}
    >
      <Grid columns={160}>
        <Grid.Col span={100}>
          <Text autoCapitalize="" align="left" fz={"xs"}>
            {orgName}
          </Text>
          <Container style={{ alignItems: "left" }}>
            <Text style={{ fontStyle: "bold", textAlign: "right" }}>
              {issue.title}
            </Text>
            <Text align="left" variant="text">
              {issue.description.slice(0, 100)}...
            </Text>
          </Container>
        </Grid.Col>
        <Grid.Col span={17}>
          <Text fz={"md"}>Deadline</Text>
          <Text fz={"lg"}>{deadlineDayCount} days</Text>
        </Grid.Col>
        <Grid.Col span={17}>
          <Text fz={"md"}>Bid Price</Text>
          <Text>
            {minPrize} ETH - {maxPrize} ETH
          </Text>
        </Grid.Col>
        <Grid.Col span={20}>
          <Anchor autoCapitalize="" href="" target={repo.link}>
            {repo.name}
          </Anchor>
          <Button onClick={() => router.push(issue.link)} color="teal" mt={20}>
            More Details
          </Button>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
