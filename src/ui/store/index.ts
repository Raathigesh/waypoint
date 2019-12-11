import { createContext } from "react";
import debounce from "lodash.debounce";
import { DependencyGraph } from "./models/DependencyGraph";
import { IndexerStatus } from "./models/IndexerStatus";
import { PathMap } from "./models/PathMap";
import { onSnapshot } from "mobx-state-tree";
import { setPathMap } from "./services/config";
import { Connections } from "./models/Connections";
import { App } from "./models/app";

const app = App.create({ separator: "" });
const pathMap = PathMap.create();
export const pathMapStore = createContext(pathMap);

const dependencyGraph = DependencyGraph.create();
export const dependencyGraphStore = createContext(dependencyGraph);
export const indexerStatusStore = createContext(
  IndexerStatus.create({ status: "none" }, { pathMap })
);
export const connectionStore = createContext(
  Connections.create(
    {
      relative: {
        x: 0,
        y: 0
      }
    },
    { dependencyGraph }
  )
);
export const appStore = createContext(app);

onSnapshot(
  pathMap,
  debounce((newSnapshot: any) => {
    setPathMap(JSON.stringify(newSnapshot));
  }, 1000)
);
