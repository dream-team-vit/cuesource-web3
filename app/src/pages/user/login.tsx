import { Button, Card, Divider, Text } from "@mantine/core";
import { IconBrandGithubFilled } from "@tabler/icons-react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export default function Login() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card
        p="xl"
        withBorder
        shadow="xl"
        className="flex flex-col items-center justify-center"
      >
        <Text>cuesource</Text>
        <Text size="sm" color="indigo">
          Open Source Quests for Developers.
        </Text>
        <Divider my="md" />
        <Text size="md" mb="md">
          Sign in to get started...
        </Text>
        <Button
          onClick={() => signIn("github")}
          size="lg"
          leftIcon={<IconBrandGithubFilled size={24} />}
          variant="outline"
        >
          Sign in with GitHub
        </Button>
      </Card>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (session) {
    const token = (await prisma.account.findFirst({
      where: { userId: session!.user.id },
    }))!.token;

    return {
      props: { session },
      redirect: {
        destination: token ? "/" : "/user/accessToken",
      },
    };
  }
  return {
    props: { session },
  };
};
