import { createContext } from "react";
import debounce from "lodash.debounce";
import { DependencyGraph } from "./models/DependencyGraph";
import { IndexerStatus } from "./models/IndexerStatus";
import { PathMap } from "./models/PathMap";
import { onSnapshot } from "mobx-state-tree";
import { setPathMap } from "./services/config";
import { App } from "./models/app";

const app = App.create({
  separator: "",
  root: "",
  fontFamily: "",
  fontSize: 0
});
const pathMap = PathMap.create();
export const pathMapStore = createContext(pathMap);

const dependencyGraph = DependencyGraph.create({
  currentColorIndex: 0,
  colors: [
    "#CBD5E0",
    "#f56565",
    "#FBD38D",
    "#9ae6b4",
    "#81E6D9",
    "#4299e1",
    "#0BC5EA",
    "#b794f4",
    "#f687b3"
  ],
  isBubbleDragging: false
});
export const dependencyGraphStore = createContext(dependencyGraph);
export const indexerStatusStore = createContext(
  IndexerStatus.create({ status: "none" }, { pathMap })
);
export const appStore = createContext(app);

onSnapshot(
  pathMap,
  debounce((newSnapshot: any) => {
    setPathMap(JSON.stringify(newSnapshot));
  }, 1000)
);
