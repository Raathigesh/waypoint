import { types, flow, getEnv } from 'mobx-state-tree';
import { Bookmark } from './Bookmark';
import { getMarkers } from 'ui/store/services/search';
import { GqlSymbolInformation } from 'entities/GqlSymbolInformation';
import { getBookmarksConfig } from 'ui/store/services/config';
import { IndexerStatus } from '../IndexerStatus';

export interface BookmarksJSON {
    name: string;
    path: string;
}

const Bookmarks = types
    .model('Bookmarks', {
        items: types.array(Bookmark),
    })
    .actions(self => {
        const env: {
            indexStatus: typeof IndexerStatus.Type;
        } = getEnv(self);

        const waitForIndexerToComplete = flow(function*() {
            return new Promise(resolve => {
                env.indexStatus.registerIndexedCallback(() => {
                    resolve();
                });
            });
        });

        const afterCreate = flow(function*() {
            yield waitForIndexerToComplete();
            restoreSavedBookmarks();
        });

        const restoreSavedBookmarks = flow(function*() {
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
            restoreSavedBookmarks,
            addBookmark,
            removeBookmark,
            getItemsForPersisting,
        };
    });

export default Bookmarks;
