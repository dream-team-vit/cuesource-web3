import {
  Avatar,
  Box,
  Button,
  Container,
  Group,
  Header,
  Menu,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import { IconChevronDown, IconLogout } from "@tabler/icons-react";

export default function HeaderSection() {
  const router = useRouter();
  const session = useSession();

  const [userMenuOpened, setUserMenuOpened] = useState(false);

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
          <Menu
            width={200}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            withinPortal
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
          >
            <Menu.Target>
              <Button variant="outline" color="gray">
                <Avatar
                  src={session.data?.user.image}
                  alt={session.data?.user.name || ""}
                  radius="xl"
                  size={20}
                  mr="xs"
                />
                <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                  {session.data?.user.name}
                </Text>
                <IconChevronDown size={rem(12)} stroke={1.5} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => signOut()}
                icon={<IconLogout color="red" size="0.9rem" stroke={1.5} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <ConnectWallet className="max-h-10" />
        </Group>
      </Header>
    </Box>
  );
}
