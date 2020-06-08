import { createContext } from "react";
import debounce from "lodash.debounce";
import { DependencyGraph } from "./models/DependencyGraph";
import { IndexerStatus } from "./models/IndexerStatus";
import { PathMap } from "./models/PathMap";
import { onSnapshot } from "mobx-state-tree";
import { setPathMap, setStageConfig } from "./services/config";
import { App } from "./models/app";
import { listenToMessages } from "ui/util/graphql";
import { getActiveFile, getActiveSymbolForFile } from "./services/file";
import Bookmarks from "./models/bookmarks";

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
    "rgb(245, 101, 101, 0.9)",
    "rgb(251, 211, 141, 0.9)",
    "rgb(154, 230, 180, 0.9)",
    "rgb(66, 153, 225, 0.9)",
    "rgb(183, 148, 244, 0.9)",
    "rgb(18, 18, 18, 0.9)",
    "rgb(230, 76, 16, 0.9)"
  ],
  isBubbleDragging: false
});
export const dependencyGraphStore = createContext(dependencyGraph);
export const indexerStatusStore = createContext(
  IndexerStatus.create(
    { status: "none", indexedFiles: 0, totalFiles: 0 },
    { pathMap, app, dependencyGraph }
  )
);
export const appStore = createContext(app);

const bookmarks = Bookmarks.create();
export const bookmarksStore = createContext(bookmarks);

onSnapshot(
  pathMap,
  debounce((newSnapshot: any) => {
    setPathMap(JSON.stringify(newSnapshot));
  }, 1000)
);

onSnapshot(dependencyGraph.symbols, () => {
  const config = dependencyGraph.getPersistableJSON();
  setStageConfig(config);
});

listenToMessages(async (event: string) => {
  if (event === "js-bubbles.addFile") {
    const gqlFile = await getActiveFile();
  } else if (event === "js-bubbles.addSymbol") {
    const symbol = await getActiveSymbolForFile();
    // dependencyGraph.setCurrentSymbol(symbol.name, symbol.filePath);
    bookmarks.addBookmark(symbol.name, symbol.filePath);
  }
});
