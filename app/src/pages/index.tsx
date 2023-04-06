import CreateQuestSelections from "~/components/CreateQuestSelections";
import HeaderSection from "~/components/Header";
import OpenQuestBoard from "~/components/OpenQuestBoard";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <HeaderSection />
      <div className="mt-3 flex w-full flex-col items-center justify-center gap-10 p-2">
        <CreateQuestSelections />

        <OpenQuestBoard />
      </div>
    </div>
  );
}
