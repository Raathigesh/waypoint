import { types } from "mobx-state-tree";

export const DocumentSymbol = types.model("DocumentSymbol", {
  id: types.string,
  name: types.string,
  filePath: types.string,
  kind: types.string
});
