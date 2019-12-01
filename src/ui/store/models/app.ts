import { types, flow, applySnapshot } from "mobx-state-tree";
import { getSeparator } from "../services";

export const App = types
  .model("App", {
    separator: types.string
  })

  .actions(self => {
    const afterCreate = flow(function*() {
      const separator = yield getSeparator();
      self.separator = separator;
    });

    return { afterCreate };
  });
