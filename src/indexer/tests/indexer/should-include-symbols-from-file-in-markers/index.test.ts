import { resolve, sep, dirname } from "path";
import Indexer from "indexer/Indexer";
import Project from "indexer/Project";
import { santizePath } from "indexer/util";

const waitForIndexer = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

describe("Indexer", () => {
  it("should have symbols from the file in the marker", async () => {
    const project: Project = {
      root: resolve(__dirname, "./project"),
      pathAlias: {},
      directories: ["."]
    };
    const indexer = new Indexer();
    await indexer.parse(project);
    await waitForIndexer();

    const functionA = indexer.getSymbolWithMarkers(
      resolve(__dirname, "./project/a.js"),
      "functionA"
    );

    expect({
      ...functionA,
      path: santizePath(project.root, functionA?.path),
      markers: functionA?.markers.map(marker => ({
        ...marker,
        filePath: santizePath(project.root, marker.filePath)
      }))
    }).toMatchSnapshot();
  });
});
