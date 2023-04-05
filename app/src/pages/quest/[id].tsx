import { useEffect } from "react";

export default function QuestID({ props }: { props: any }) {
  useEffect(() => {
    console.log(props);
  });

  return <div></div>;
}
