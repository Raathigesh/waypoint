import { types, flow, getEnv } from "mobx-state-tree";
import { indexerStatus, startIndexing } from "../services";
import { PathMap } from "./PathMap";
import { App } from "./app";
import { DependencyGraph } from "./DependencyGraph";
import { GqlIndexerStatus } from "entities/GqlIndexerStatus";
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const IndexerStatus = types
  .model("IndexerStatus", {
    status: types.string,
    totalFiles: types.number,
    indexedFiles: types.number
  })
  .actions(self => {
    const getStatus = flow(function*() {
      const status: GqlIndexerStatus = yield indexerStatus();
      self.status = status.status;
      self.indexedFiles = status.indexedFileCount;
      self.totalFiles = status.totalFiles;
    });

    const pollForStatus: () => Promise<any> = flow(function*() {
      const env: {
        dependencyGraph: typeof DependencyGraph.Type;
      } = getEnv(self);
      const status: GqlIndexerStatus = yield indexerStatus();

      if (
        (status.status === "indexed" && self.status === "indexing") ||
        status.status === "indexed"
      ) {
        env.dependencyGraph.initializeStage();
      }

      self.status = status.status;
      self.indexedFiles = status.indexedFileCount;
      self.totalFiles = status.totalFiles;
      while (true && self.status === "indexing") {
        yield sleep(1000);
        yield pollForStatus();
      }
    });

    const initiateIndexing = flow(function*() {
      const env: {
        pathMap: typeof PathMap.Type;
        app: typeof App.Type;
      } = getEnv(self);

      startIndexing(
        env.pathMap.items.map(item => ({ alias: item.alias, path: item.path })),
        [...env.app.directories.values()]
      );
      self.status = "indexing";
      pollForStatus();
    });

    return { getStatus, pollForStatus, initiateIndexing };
  });
