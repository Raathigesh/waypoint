import { createContext } from "react";
import debounce from "lodash.debounce";
import { IndexerStatus } from "./models/IndexerStatus";
import { PathMap } from "./models/PathMap";
import { onSnapshot } from "mobx-state-tree";
import {
  setPathMap,
  setBookmarksConfig,
  setPreference
} from "./services/config";
import { App } from "./models/app";
import { listenToMessages } from "ui/util/graphql";
import { getActiveSymbolForFile } from "./services/file";
import Bookmarks from "./models/bookmarks";
import { Preference } from "./models/Preference";

const app = App.create({
  separator: "",
  root: ""
});
const pathMap = PathMap.create();
export const pathMapStore = createContext(pathMap);

export const indexerStatusStore = createContext(
  IndexerStatus.create(
    { status: "none", indexedFiles: 0, totalFiles: 0 },
    { pathMap, app }
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

listenToMessages(async (event: string) => {
  if (event === "waypoint.addSymbol") {
    const symbol = await getActiveSymbolForFile();
    bookmarks.addBookmark(symbol.name, symbol.filePath);
  }
});

onSnapshot(bookmarks.items, () => {
  const items = bookmarks.getItemsForPersisting();
  setBookmarksConfig(items);
});

const preference = Preference.create({
  startIndexingOnStarUp: false
});
export const preferenceStore = createContext(preference);

onSnapshot(preference, () => {
  const preferenceJSON = preference.getPersistableJson();
  setPreference(preferenceJSON);
});
