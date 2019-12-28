import { types } from "mobx-state-tree";
import { DocumentLocation } from "./DocumentLocation";

export const Marker = types.model("Marker", {
  id: types.string,
  filePath: types.string,
  name: types.string,
  location: types.maybeNull(DocumentLocation),
  color: types.string
});

export const DocumentSymbol = types.model("DocumentSymbol", {
  id: types.string,
  name: types.string,
  filePath: types.string,
  kind: types.string,
  code: types.maybeNull(types.string),
  location: types.maybeNull(DocumentLocation),
  markers: types.array(Marker),
  color: types.maybe(types.string),
  createdForMarker: types.maybe(
    types.model({
      markerId: types.string,
      symbolId: types.string
    })
  ),
  x: types.maybe(types.number),
  y: types.maybe(types.number)
});
