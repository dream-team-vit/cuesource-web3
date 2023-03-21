import { Button } from "@mantine/core";
import { ConnectWallet } from "@thirdweb-dev/react";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <div>
      <ConnectWallet />
    </div>
  );
};

export default Home;
