import { Suspense, useState } from "react";
import { useStage } from "contexts/Stage";
import Narrator from "mediators/Narrator";
import Book from "models/Book";
import FaceWhenNear from "modifiers/FaceWhenNear";
import { useFrame } from "react-three-fiber";
import Purpose from "mediators/Purpose";
import FacePlayer from "../../modifiers/FacePlayer";

export default function Welcome() {
  const { stage } = useStage();

  const ACTIVE = stage === "welcome";
  const PURPOSE_DIST = 5;
  const BOOK_DIST = 1.6;

  const [foundPurpose, setFoundPurpose] = useState(false);
  const [openBook, setOpenBook] = useState(false);

  useFrame(({ camera, clock }) => {
    if (ACTIVE && clock.getElapsedTime() > 2) {
      if (!foundPurpose && camera.position.length() < PURPOSE_DIST) {
        setFoundPurpose(true);
      }

      if (!openBook && camera.position.length() < BOOK_DIST) {
        setOpenBook(true);
      } else if (openBook && camera.position.length() > BOOK_DIST) {
        setOpenBook(false);
      }
    }
  });

  if (!ACTIVE) return null;

  return (
    <group name="stage-welcome">
      <Narrator message="i was left wondering" follow show={!foundPurpose} />
      <Narrator
        message="can we wake up now"
        position={[0, 1.1, -0.4]}
        show={foundPurpose}
      />
      <Purpose visible={foundPurpose} />
      <Suspense fallback={null}>
        <FaceWhenNear dist={PURPOSE_DIST}>
          <group position-y={0.1}>
            <Book open={openBook} />
          </group>
        </FaceWhenNear>
      </Suspense>
    </group>
  );
}
