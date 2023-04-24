import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import OpenQuestBoard from "~/components/OpenQuestBoard";
import { Wrapper } from "~/components/Wrapper";
import { authOptions } from "~/server/auth";

export default function QuestsPage() {
  return (
    <Wrapper>
      <OpenQuestBoard />
    </Wrapper>
  );
}
