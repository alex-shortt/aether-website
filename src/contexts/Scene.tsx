import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useRef,
} from "react";

type SceneState = {
  mediation: MutableRefObject<number>;
};

const SceneContext = createContext({} as SceneState);

export function useScene() {
  return useContext(SceneContext);
}

export function SceneProvider(props: { children: ReactNode | ReactNode[] }) {
  const mediation = useRef(0);

  const state: SceneState = {
    mediation,
  };

  return (
    <SceneContext.Provider value={state}>
      {props.children}
    </SceneContext.Provider>
  );
}
