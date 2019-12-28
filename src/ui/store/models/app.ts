import { types, flow, applySnapshot } from "mobx-state-tree";
import { getProjectInfo } from "../services";
import { GqlProjectInfo } from "entities/GqlProjectInfo";

export const App = types
  .model("App", {
    separator: types.string,
    root: types.string
  })
  .actions(self => {
    const afterCreate = flow(function*() {
      const project: GqlProjectInfo = yield getProjectInfo();
      self.separator = project.separator;
      self.root = project.root;
    });

    return { afterCreate };
  });
