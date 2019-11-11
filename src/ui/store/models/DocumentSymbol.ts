import { types } from "mobx-state-tree";
import { DocumentPosition, DocumentLocation } from "./DocumentLocation";

export const DocumentSymbol = types.model("DocumentSymbol", {
  id: types.string,
  name: types.string,
  filePath: types.string,
  kind: types.string,
  location: types.maybeNull(DocumentLocation)
});
