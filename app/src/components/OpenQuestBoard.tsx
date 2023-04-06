import { Center, Divider, Title } from "@mantine/core";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useEffect } from "react";
import { contractAddress } from "~/utils/contract";
import { QuestCard } from "./QuestCard";

export default function OpenQuestBoard() {
  const { contract } = useContract(contractAddress);
  const { data: quests, isLoading } = useContractRead(contract, "getQuests");

  useEffect(() => {
    console.log(quests);
  }, [isLoading]);

  if (isLoading) return null;
  return (
    <Center className="flex w-full flex-col items-center justify-center gap-10">
      <Divider
        label={<Title order={2}>Open Quests</Title>}
        labelPosition="center"
        className="w-full"
      ></Divider>
      {(quests as Array<any>)
        .filter((quest) => !quest.accepted as boolean)
        .map((quest) => quest && <QuestCard quest={quest} />)}
    </Center>
  );
}
