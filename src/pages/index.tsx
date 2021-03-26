import { NextPage } from "next";
import dynamic from "next/dynamic";

const Aether = dynamic(import("scenes/Aether"), { ssr: false });

const StarterPage: NextPage = () => {
  return <Aether />;
};

export default StarterPage;
