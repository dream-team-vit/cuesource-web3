import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Localhost } from "@thirdweb-dev/chains";

const TheApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>cuesource</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={session}>
        <ThirdwebProvider autoConnect activeChain={Localhost}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              /** Put your mantine theme override here */
              colorScheme: "dark",
              fontFamily: "Open Sans",
              primaryColor: "indigo",
            }}
          >
            <Component {...pageProps} />
            <Notifications />
          </MantineProvider>
        </ThirdwebProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(TheApp);
