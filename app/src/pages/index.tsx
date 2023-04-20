import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import CreateQuestSelections from "~/components/CreateQuestSelections";
import OpenQuestBoard from "~/components/OpenQuestBoard";
import { Wrapper } from "~/components/Wrapper";
import { authOptions } from "~/server/auth";

export default function Home() {
  return (
    <Wrapper>
      <CreateQuestSelections />
      <OpenQuestBoard />
    </Wrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  return {
    props: { session },
    redirect:
      session === null
        ? {
            destination: "/user/login",
            permanent: true,
          }
        : undefined,
  };
};
