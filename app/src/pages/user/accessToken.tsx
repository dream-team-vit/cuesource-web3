import { Button, Card, TextInput } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

export default function AuthToken() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const setAccessTokenMutation =
    api.github.setPersonalAccessToken.useMutation();

  const setAccessToken = async () => {
    await setAccessTokenMutation.mutateAsync({ token });
    router.push("/");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card shadow="xl" p="xl" withBorder className="w-3/5">
        <TextInput
          placeholder="Enter token"
          label="Personal Access Token"
          withAsterisk
          py="lg"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <div className="flex items-center justify-end">
          <Button onClick={setAccessToken} color="indigo" variant="outline">
            Set
          </Button>
        </div>
      </Card>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const token = (await prisma.account.findFirst({
    where: { userId: session!.user.id },
  }))!.token;

  return {
    props: { session },
    redirect:
      session !== null && token
        ? {
            destination: "/",
            permanent: true,
          }
        : undefined,
  };
};
