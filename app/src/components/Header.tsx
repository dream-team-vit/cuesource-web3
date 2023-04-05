import {
  Box,
  Button,
  Group,
  Header,
  Modal,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { signIn, useSession } from "next-auth/react";
import { ConnectWallet, useMetamask } from "@thirdweb-dev/react";
import { api } from "~/utils/api";
import { useState } from "react";

export default function HeaderSection() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const [token, setToken] = useState("");

  const session = useSession();
  const { data: isAccessTokenPresent } =
    api.github.checkPersonalAccessToken.useQuery();

  const { data: access_token } = api.github.getPersonalAccessToken.useQuery();

  const setAccessTokenMutation =
    api.github.setPersonalAccessToken.useMutation();

  const setAccessToken = async () => {
    await setAccessTokenMutation.mutateAsync({ token });
    setOpened(false);
  };

  return (
    <Box>
      <Header
        height={60}
        px="md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          align="center"
          fw={500}
          onClick={() => {
            router.push("/");
          }}
          sx={{
            fontSize: "1.4rem",
            color: "white",
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          CueSource
        </Text>

        <Group
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,auto)",
          }}
        >
          <Button
            onClick={() => signIn("github")}
            variant="default"
            display={"block"}
          >
            {session.status !== "authenticated"
              ? "Login with GitHub"
              : `Hey! ${session.data.user.name}`}
          </Button>
          {session.status === "authenticated" && !access_token ? (
            <Button onClick={() => setOpened(true)} variant="outline">
              Add Personal Access Token
            </Button>
          ) : null}
          <ConnectWallet />
        </Group>
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Set your Personal Access Token"
          centered
          transitionProps={{ transition: "fade", duration: 200 }}
        >
          <TextInput
            placeholder="Enter token"
            label="Personal token access"
            withAsterisk
            py={15}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <Button onClick={setAccessToken} variant="outline">
            Set
          </Button>
        </Modal>
      </Header>
    </Box>
  );
}
