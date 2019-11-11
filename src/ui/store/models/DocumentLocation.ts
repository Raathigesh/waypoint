import { types } from "mobx-state-tree";

export const DocumentPosition = types.model("DocumentPosition", {
  line: types.number,
  column: types.number
});

export const DocumentLocation = types.model("DocumentLocation", {
  start: DocumentPosition,
  end: DocumentPosition
});
