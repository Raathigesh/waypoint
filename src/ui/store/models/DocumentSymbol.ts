import { types } from "mobx-state-tree";
import { DocumentLocation } from "./DocumentLocation";

export const Marker = types.model("Marker", {
  filePath: types.string,
  name: types.string,
  location: types.maybeNull(DocumentLocation)
});

export const DocumentSymbol = types.model("DocumentSymbol", {
  id: types.string,
  name: types.string,
  filePath: types.string,
  kind: types.string,
  code: types.string,
  location: types.maybeNull(DocumentLocation),
  markers: types.array(Marker)
});
