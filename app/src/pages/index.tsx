import { Button } from "@mantine/core";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <div>
      <Button>Hey</Button>
    </div>
  );
};

export default Home;
