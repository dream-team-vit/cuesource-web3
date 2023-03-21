import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import { rtlCache } from "~/utils/rtl-cache";

const TheApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>OpenQuests</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "dark",
          }}
          emotionCache={rtlCache}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(TheApp);
