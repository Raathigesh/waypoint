import { types, flow } from 'mobx-state-tree';
import { Bookmark } from './Bookmark';
import { getMarkers } from 'ui/store/services/search';
import { GqlSymbolInformation } from 'entities/GqlSymbolInformation';
import { getBookmarksConfig } from 'ui/store/services/config';

export interface BookmarksJSON {
    name: string;
    path: string;
}

const Bookmarks = types
    .model('IndexerStatus', {
        items: types.array(Bookmark),
    })
    .actions(self => {
        const afterCreate = flow(function*() {
            const bookmarks: BookmarksJSON[] = yield getBookmarksConfig();
            bookmarks.forEach(bookmark => {
                addBookmark(bookmark.name, bookmark.path);
            });
        });

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
                        line: symbolWithMakers?.location?.start?.line || 0,
                    },
                    end: {
                        column: symbolWithMakers?.location?.end?.column || 0,
                        line: symbolWithMakers?.location?.end?.line || 0,
                    },
                },
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

        const getItemsForPersisting = () => {
            return self.items.map(item => ({
                name: item.name,
                path: item.filePath,
            }));
        };

        return {
            afterCreate,
            addBookmark,
            removeBookmark,
            getItemsForPersisting,
        };
    });

export default Bookmarks;
