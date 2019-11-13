import { createContext } from "react";
import debounce from "lodash.debounce";
import { DependencyGraph } from "./models/DependencyGraph";
import { IndexerStatus } from "./models/IndexerStatus";
import { PathMap } from "./models/PathMap";
import { onSnapshot } from "mobx-state-tree";
import { setPathMap } from "./services/config";

const pathMap = PathMap.create();
export const pathMapStore = createContext(pathMap);
export const dependencyGraphStore = createContext(DependencyGraph.create());
export const indexerStatusStore = createContext(
  IndexerStatus.create({ status: "none" }, { pathMap })
);

onSnapshot(
  pathMap,
  debounce((newSnapshot: any) => {
    setPathMap(JSON.stringify(newSnapshot));
  }, 1000)
);
