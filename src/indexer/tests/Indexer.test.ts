import "reflect-metadata";
import Indexer from "../Indexer";
import { resolve, sep } from "path";

describe("Indexer", () => {
  it("should index files", async () => {
    const indexer = new Indexer();
    const root = resolve(__dirname, "./project");
    await indexer.parse({
      root,
      pathAlias: {
        project: "."
      }
    });

    const references = indexer.findReferences(
      resolve(__dirname, "./project/query/items.js"),
      "getInStockCount"
    );

    const normalized = references.map(reference =>
      reference.path.replace(root, "").split(sep)
    );

    expect(normalized).toMatchInlineSnapshot(`
      Array [
        Array [
          "",
          "store",
          "Root.js",
        ],
      ]
    `);
  });
});
