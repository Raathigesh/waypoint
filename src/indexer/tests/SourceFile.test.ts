import SourceFile from "../SourceFile";
import { resolve, sep } from "path";

describe("SourceFile", () => {
  it("should have named exports", async () => {
    const sourceFile = new SourceFile();
    await sourceFile.parse(
      resolve(__dirname, "./project/query/items.js"),
      {},
      ""
    );

    expect(
      sourceFile.symbols.map(symbol => ({ ...symbol, id: "" }))
    ).toMatchSnapshot();

    expect(sourceFile.importStatements).toMatchSnapshot();
  });

  it("should identify markers", async () => {
    const sourceFile = new SourceFile();
    await sourceFile.parse(
      resolve(__dirname, "./project/store/Root.js"),
      {},
      ""
    );

    const root = resolve(__dirname, "./project");

    const symbols = sourceFile.symbols.map(symbol => ({
      ...symbol,
      markers: symbol.markers.map(marker => ({
        ...marker,
        filePath: marker.filePath
          .replace(root, "root")
          .split(sep)
          .join("/")
      })),
      id: "",
      path: symbol.path
        .replace(root, "root")
        .split(sep)
        .join("/")
    }));

    expect(symbols).toMatchSnapshot();

    expect(
      sourceFile.importStatements.map(item => ({
        ...item,
        path: item.path
          .replace(root, "root")
          .split(sep)
          .join("/")
      }))
    ).toMatchSnapshot();
  });
});
