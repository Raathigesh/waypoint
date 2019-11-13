import { types, flow } from "mobx-state-tree";
import { indexerStatus, startIndexing } from "../services";
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
      startIndexing();
      self.status = "indexing";
      pollForStatus();
    });

    return { getStatus, pollForStatus, initiateIndexing };
  });
