import { Center, Divider, Title } from "@mantine/core";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useEffect } from "react";
import { contractAddress } from "~/utils/contract";
import { QuestCard } from "./QuestCard";

export default function OpenQuestBoard() {
  const { contract } = useContract(contractAddress);
  const { data: quests, isLoading } = useContractRead(contract, "getQuests");

  if (isLoading || quests.length === 0) return null;
  return (
    <Center className="flex w-full flex-col items-center justify-center gap-10">
      <Divider
        label={<Title order={2}>quests</Title>}
        labelPosition="left"
        className="w-3/4"
      ></Divider>
      {(quests as Array<any>)
        .filter((quest) => !quest.accepted as boolean)
        .map(
          (quest, index) =>
            quest && <QuestCard key={index} quest={quest} id={index} />
        )}
    </Center>
  );
}
