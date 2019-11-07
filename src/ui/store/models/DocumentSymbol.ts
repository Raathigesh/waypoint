import { types } from "mobx-state-tree";

const DocumentSymbol = types.model("DocumentSymbol", {
  name: types.string,
  filePath: types.string,
  kind: types.string
});
