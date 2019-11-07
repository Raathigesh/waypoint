import { types } from "mobx-state-tree";

const DocumentPosition = types.model("DocumentPosition", {
  line: types.number,
  character: types.number
});

const DocumentLocation = types.model("DocumentLocation", {
  start: DocumentPosition,
  end: DocumentPosition
});
