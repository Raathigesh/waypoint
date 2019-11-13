import { types, flow, applySnapshot } from "mobx-state-tree";
import * as nanoid from "nanoid";
import { getPathMap } from "../services/config";

export const PathMapItem = types.model("PathMapItem", {
  id: types.string,
  alias: types.string,
  path: types.string
});

export const PathMap = types
  .model("PathMap", {
    items: types.array(PathMapItem)
  })

  .actions(self => {
    const afterCreate = flow(function*() {
      const pathMap = yield getPathMap();
      applySnapshot(self, JSON.parse(pathMap));
    });

    const addNewItem = (alias: string, path: string) => {
      self.items.push({
        id: nanoid(),
        alias,
        path
      });
    };

    const update = (id: string, alias: string, path: string) => {
      const item = self.items.find(item => item.id == id);
      if (item) {
        item.alias = alias;
        item.path = path;
      }
    };

    const remove = (id: string) => {
      const itemToRemove = self.items.find(item => item.id === id);
      if (itemToRemove) {
        self.items.remove(itemToRemove);
      }
    };

    return { afterCreate, addNewItem, update, remove };
  });
