import { Avatar, Box, Group, Header, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function HeaderSection() {
  const router = useRouter();
  const session = useSession();

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
          {session.status === "authenticated" && (
            <Avatar
              src={session.data.user.image}
              radius="lg"
              className="cursor-pointer"
            />
          )}

          <ConnectWallet className="max-h-10" />
        </Group>
      </Header>
    </Box>
  );
}
