import { useContext } from "react";
import { AnimationsContext } from "../context/AnimationsContext";

const useAnimations = () => useContext(AnimationsContext);
export default useAnimations;

