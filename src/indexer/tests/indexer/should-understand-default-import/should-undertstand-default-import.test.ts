import { resolve } from "path";
import Indexer from "indexer/Indexer";
import Project from "indexer/Project";
import { santizePath } from "indexer/util";
import { Marker } from "indexer/ESModuleItem";

const waitForIndexer = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

describe("Indexer", () => {
  it("should include default import as markers", async () => {
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
      "consumer"
    );

    expect({
      ...functionA,
      path: santizePath(project.root, functionA?.path),
      markers: functionA?.markers.map((marker: Marker) => ({
        ...marker,
        filePath: santizePath(project.root, marker.filePath)
      }))
    }).toMatchSnapshot();
  });

  it("should return symbol when requested with the default imported name", async () => {
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
      "@@DEFAULT_EXPORT@@"
    );

    expect({
      ...functionA,
      path: santizePath(project.root, functionA?.path),
      markers: functionA?.markers.map((marker: Marker) => ({
        ...marker,
        filePath: santizePath(project.root, marker.filePath)
      }))
    }).toMatchSnapshot();
  });
});
