import { Suspense } from "react";
import { useStage } from "contexts/Stage";
import Narrator from "mediators/Narrator";
import Book from "models/Book";

export default function Welcome() {
  const { stage } = useStage();

  if (stage !== "welcome") return null;

  return (
    <group name="stage-welcome">
      <Narrator message="holy hell does this thing even work?" />
      <Suspense fallback={null}>
        <group scale={[0.15, 0.15, 0.15]} rotation-x={-Math.PI / 2}>
          <Book />
        </group>
      </Suspense>
    </group>
  );
}
