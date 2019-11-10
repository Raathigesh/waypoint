import { createContext } from "react";
import { DependencyGraph } from "./models/DependencyGraph";

export const dependencyGraphStore = createContext(DependencyGraph.create());
