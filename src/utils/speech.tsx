import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export const useSpeech = (message: string, speed = 0.05): string => {
  const [str, setStr] = useState("");
  const [needsReset, setNeedsReset] = useState(false);
  const startTime = useRef<number>();

  useFrame(({ clock }) => {
    if (!startTime.current || needsReset) {
      startTime.current = clock.getElapsedTime();
      setNeedsReset(false);
    } else if (str !== message) {
      const elapsed = clock.getElapsedTime() - startTime.current;
      const count = Math.floor(elapsed / speed);
      const newString = message.substr(0, count);
      if (newString !== str) {
        setStr(newString);
      }
    }
  });

  useEffect(() => {
    setStr("");
    setNeedsReset(true);
  }, [message]);

  return str;
};
