import {
  Avatar,
  Box,
  Button,
  Group,
  Header,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { api } from "~/utils/api";
import { useState } from "react";

export default function HeaderSection() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const [token, setToken] = useState("");

  const session = useSession();

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
          onClick={() => {
            router.push("/");
          }}
          size="xl"
          className="cursor-pointer font-['Lato'] font-extrabold text-slate-500 dark:text-white"
        >
          cuesource
        </Text>

        <Group
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,auto)",
          }}
        >
          {session.status !== "authenticated" ? (
            <Button
              onClick={() => signIn("github")}
              variant="default"
              display={"block"}
            >
              Login with GitHub
            </Button>
          ) : (
            <Avatar
              src={session.data.user.image}
              radius="lg"
              className="cursor-pointer"
            />
          )}
          {session.status === "authenticated" && !access_token ? (
            <Button
              onClick={() => setOpened(true)}
              color="indigo"
              variant="outline"
            >
              Add Token
            </Button>
          ) : null}
          <ConnectWallet className="max-h-10" />
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
          <div className="flex items-center justify-end">
            <Button onClick={setAccessToken} color="indigo" variant="outline">
              Set
            </Button>
          </div>
        </Modal>
      </Header>
    </Box>
  );
}
