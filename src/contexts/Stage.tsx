import { createContext, ReactNode, useContext, useState } from "react";

type StageState = {
  stage: string;
  setStage: (s: string) => void;
};

const StageContext = createContext({} as StageState);

export function useStage() {
  return useContext(StageContext);
}

export function StageProvider(props: { children: ReactNode | ReactNode[] }) {
  const [stage, setStage] = useState("welcome");

  const state: StageState = {
    stage,
    setStage,
  };

  return (
    <StageContext.Provider value={state}>
      {props.children}
    </StageContext.Provider>
  );
}
