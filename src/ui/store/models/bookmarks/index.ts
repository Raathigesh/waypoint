import { types, flow } from "mobx-state-tree";
import { Bookmark } from "./Bookmark";
import { getMarkers } from "ui/store/services/search";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";

const Bookmarks = types
  .model("IndexerStatus", {
    items: types.array(Bookmark)
  })
  .actions(self => {
    const addBookmark = flow(function*(name: string, path: string) {
      const symbolWithMakers: GqlSymbolInformation = yield getMarkers(
        path,
        name
      );

      const bookmark = Bookmark.create({
        filePath: path,
        name: name,
        kind: symbolWithMakers.kind,
        location: {
          start: {
            column: symbolWithMakers?.location?.start?.column || 0,
            line: symbolWithMakers?.location?.start?.line || 0
          },
          end: {
            column: symbolWithMakers?.location?.end?.column || 0,
            line: symbolWithMakers?.location?.end?.line || 0
          }
        }
      });

      self.items.push(bookmark);
    });

    const removeBookmark = (name: string, path: string) => {
      const itemToRemove = self.items.find(
        item => item.name === name && item.filePath === path
      );
      if (itemToRemove) {
        self.items.remove(itemToRemove);
      }
    };

    return {
      addBookmark,
      removeBookmark
    };
  });

export default Bookmarks;
