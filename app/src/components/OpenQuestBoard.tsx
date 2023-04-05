import { Card } from "@mantine/core";
import QuestCard, { QuestCardProps } from "./QuestCard";

const data: QuestCardProps[] = [
  {
    deadlineDayCount: 7,
    issue: {
      description: `
			💭 Description
			The Getting Started link at the bottom of the readme file (below the Learn More section) looks wrong. If you click on it, you will be navigated to getting started with flutter docs. even in the last link, flutter have been mentioned in it. "Appwrite Flutter Playground".

			also, the "Code of Conduct" link is broken too. I didn't see such a file nor in this repo or appwrite itself.

			👀 Have you spent some time to check if this issue has been raised before?
			I checked and didn't find similar issue
			🏢 Have you read the Code of Conduct?
			I have read the Code of Conduct
			`,
      title: "📚 Documentation: links looks wrong at the bottom of Readme file",
      link: "https://github.com/appwrite/sdk-for-web/issues/44",
    },
    maxPrize: 4,
    minPrize: 2,
    orgName: "appwrite",
    repo: {
      name: "sdk-for-web",
      link: "https://github.com/appwrite/sdk-for-web",
    },
  },
];

export default function OpenQuestBoard() {
  return (
    <Card p="sm">
      {data.map((quest) => (
        <QuestCard
          deadlineDayCount={quest.deadlineDayCount}
          issue={quest.issue}
          maxPrize={quest.maxPrize}
          minPrize={quest.minPrize}
          orgName={quest.orgName}
          repo={quest.repo}
          key={"@2324324"}
        />
      ))}
    </Card>
  );
}
