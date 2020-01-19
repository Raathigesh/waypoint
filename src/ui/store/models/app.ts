import { types, flow, applySnapshot } from "mobx-state-tree";
import * as nanoid from "nanoid";
import { getProjectInfo } from "../services";
import { GqlProjectInfo } from "entities/GqlProjectInfo";
import {
  setFontSize,
  getFontSize,
  getDirectories,
  setDirectories
} from "../services/config";

export const App = types
  .model("App", {
    separator: types.string,
    root: types.string,
    fontFamily: types.string,
    fontSize: types.number,
    directories: types.map(types.string)
  })
  .actions(self => {
    const afterCreate = flow(function*() {
      const project: GqlProjectInfo = yield getProjectInfo();
      const fontSize = yield getFontSize();
      self.separator = project.separator;
      self.root = project.root;
      self.fontFamily = project.fontFamily;
      self.fontSize = Number(fontSize) || project.fontSize;

      const directories: string[] = yield getDirectories();
      directories.forEach(directory => {
        self.directories.set(nanoid(), directory);
      });
    });

    const changeFontSize = (fontSize: number) => {
      self.fontSize = fontSize;
      setFontSize((fontSize || 0).toString());
    };

    const addDirectory = (path: string) => {
      self.directories.set(nanoid(), path);
      setDirectories([...self.directories.values()]);
    };

    const changeDirectory = (id: string, directory: string) => {
      self.directories.set(id, directory);
      setDirectories([...self.directories.values()]);
    };

    const removeDirectory = (id: string) => {
      self.directories.delete(id);
      setDirectories([...self.directories.values()]);
    };

    return {
      afterCreate,
      changeFontSize,
      addDirectory,
      changeDirectory,
      removeDirectory
    };
  });
