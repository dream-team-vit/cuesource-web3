import { Button, Modal, NumberInput, Textarea, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBug, IconChecks } from "@tabler/icons-react";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";
import { contractAddress } from "~/utils/contract";
// import { contract } from "~/utils/contract";

export const CreateQuestModal: React.FC<{
  opened: boolean;
  onClose: () => void;
  _issueNumber: number;
  _repoId: number;
}> = ({ opened, onClose, _issueNumber, _repoId }) => {
  const [_description, setDescription] = useState("");
  const [_minPrize, setMinPrize] = useState(0);
  const [_maxPrize, setMaxPrize] = useState(0);
  const [_deadlineDayCount, setDeadlineDayCount] = useState(7);

  const emptyModalFields = () => {
    setDescription("");
    setMinPrize(0);
    setMaxPrize(0);
    setDeadlineDayCount(7);
  };

  const closeup = (status: "success" | "error") => {
    emptyModalFields();
    // close the modal
    onClose();

    status === "success"
      ? notifications.show({
          message: "The Quest Was Created Successfully!",
          color: "green",
          icon: <IconChecks />,
        })
      : notifications.show({
          message: "There was a problem creating the quest",
          icon: <IconBug />,
          color: "red",
        });
  };

  const address = useAddress();
  const { contract } = useContract(contractAddress);

  const {
    mutateAsync: createQuest,
    isLoading,
    error,
  } = useContractWrite(contract, "createQuest");

  const create = async () => {
    try {
      const _owner = address;
      await createQuest(
        [
          _owner,
          _description,
          _minPrize,
          _maxPrize,
          _deadlineDayCount,
          _issueNumber,
          _repoId,
        ],
        {
          onSuccess: (data) => {
            // TODO: REMOVE THIS LATER
            console.log(data);
            closeup("success");
          },
          onError: () => {
            closeup("error");
          },
        }
      );
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  if (isLoading || error) return null;

  return (
    <Modal opened={opened} onClose={onClose} title="Create Quest">
      <Textarea
        cols={5}
        value={_description}
        onChange={(e) => setDescription(e.target.value)}
        label="Description"
        placeholder="Add any other info you'd want to convey to the developers"
      />

      <TextInput
        value={_minPrize}
        onChange={(e) => setMinPrize(parseInt(e.target.value))}
        label="Minimum Pay Ammount (ETH)"
      />

      <TextInput
        value={_maxPrize}
        onChange={(e) => setMaxPrize(parseInt(e.target.value))}
        label="Maximum Pay Ammount (ETH)"
      />

      <TextInput
        value={_deadlineDayCount}
        onChange={(e) => setDeadlineDayCount(parseInt(e.target.value))}
        label="Deadline Day Count"
      />

      <Button mt="sm" variant="outline" onClick={create}>
        Create Quest
      </Button>
    </Modal>
  );
};
