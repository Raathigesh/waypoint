import { findAbsoluteFilePathWhichExists } from "indexer/fileResolver";
import { resolve, join, sep } from "path";

describe("findAbsoluteFilePathWhichExists", () => {
  const root = resolve(__dirname, "./project");
  it("should resolve based on path alias map", () => {
    const results = findAbsoluteFilePathWhichExists(
      root,
      join(root, "./view"),
      "project/query",
      {
        project: "."
      }
    );

    expect(
      results
        .replace(root, "root")
        .split(sep)
        .join("/")
    ).toMatchInlineSnapshot(`"root/query/index.js"`);
  });

  it("should resolve relative path", () => {
    const results = findAbsoluteFilePathWhichExists(
      root,
      join(root, "./store"),
      "../query/items",
      {
        project: "."
      }
    );

    expect(
      results
        .replace(root, "root")
        .split(sep)
        .join("/")
    ).toMatchInlineSnapshot(`"root/query/items.js"`);
  });
});
