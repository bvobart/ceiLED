import { useContext } from "react";
import { AnimationsContext } from "./AnimationsContext";

const useAnimations = () => useContext(AnimationsContext);
export default useAnimations;

