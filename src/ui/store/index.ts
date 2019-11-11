import { createContext } from "react";
import { DependencyGraph } from "./models/DependencyGraph";
import { IndexerStatus } from "./models/IndexerStatus";

export const dependencyGraphStore = createContext(DependencyGraph.create());
export const indexerStatusStore = createContext(
  IndexerStatus.create({ status: "none" })
);
