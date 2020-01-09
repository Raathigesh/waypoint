import { types, flow, applySnapshot } from "mobx-state-tree";
import { getProjectInfo } from "../services";
import { GqlProjectInfo } from "entities/GqlProjectInfo";
import { setFontSize, getFontSize } from "../services/config";

export const App = types
  .model("App", {
    separator: types.string,
    root: types.string,
    fontFamily: types.string,
    fontSize: types.number
  })
  .actions(self => {
    const afterCreate = flow(function*() {
      const project: GqlProjectInfo = yield getProjectInfo();
      const fontSize = yield getFontSize();
      self.separator = project.separator;
      self.root = project.root;
      self.fontFamily = project.fontFamily;
      self.fontSize = Number(fontSize) || project.fontSize;
    });

    const changeFontSize = (fontSize: number) => {
      self.fontSize = fontSize;
      setFontSize((fontSize || 0).toString());
    };

    return { afterCreate, changeFontSize };
  });
