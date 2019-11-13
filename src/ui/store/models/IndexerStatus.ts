import { types, flow, getEnv } from "mobx-state-tree";
import { indexerStatus, startIndexing } from "../services";
import { PathMap } from "./PathMap";
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const IndexerStatus = types
  .model("IndexerStatus", {
    status: types.string
  })
  .actions(self => {
    const getStatus = flow(function*() {
      const status: string = yield indexerStatus();
      self.status = status;
    });

    const pollForStatus: () => Promise<any> = flow(function*() {
      const status: string = yield indexerStatus();
      self.status = status;

      while (true && self.status === "indexing") {
        yield sleep(1000);
        yield pollForStatus();
      }
    });

    const initiateIndexing = flow(function*() {
      const env: {
        pathMap: typeof PathMap.Type;
      } = getEnv(self);

      startIndexing(
        env.pathMap.items.map(item => ({ alias: item.alias, path: item.path }))
      );
      self.status = "indexing";
      pollForStatus();
    });

    return { getStatus, pollForStatus, initiateIndexing };
  });
