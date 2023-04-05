import CreateQuestSelections from "~/components/CreateQuestSelections";
import HeaderSection from "~/components/Header";
import OpenQuestBoard from "~/components/OpenQuestBoard";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        // alignItems: "center",
        flexDirection: "column",
      }}
    >
      <HeaderSection />
      <div
        style={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          marginTop: "10px",
        }}
      >
        <CreateQuestSelections />

        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <OpenQuestBoard />
          <OpenQuestBoard />
        </div> */}
      </div>
    </div>
  );
}
