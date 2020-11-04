import { types, flow } from 'mobx-state-tree';
import { DocumentLocation } from '../DocumentLocation';
import { GqlSymbolInformation } from 'entities/GqlSymbolInformation';
import { getHistoryItems } from 'ui/store/services/file';

const NavigationEntry = types.model('NavigationEntry', {
    lastVisited: types.number,
    filePath: types.string,
    name: types.string,
    kind: types.string,
    location: types.maybeNull(DocumentLocation),
});

const Workspace = types
    .model('Workspace', {
        entries: types.array(NavigationEntry),
    })
    .actions(self => ({
        afterCreate: flow(function*() {
            const symbol: {
                symbol: GqlSymbolInformation;
                lastVisited: number;
            }[] = yield getHistoryItems();
            const filteredItems = symbol.filter(
                item => item.symbol.filePath !== ''
            );
            filteredItems.sort((a, b) => b.lastVisited - a.lastVisited);

            filteredItems.forEach(item => {
                self.entries.push(
                    NavigationEntry.create({
                        filePath: item.symbol.filePath,
                        kind: item.symbol.kind,
                        name: item.symbol.name,
                        lastVisited: item.lastVisited,
                        location: {
                            start: {
                                column:
                                    item.symbol?.location?.start?.column || 0,
                                line: item.symbol?.location?.start?.line || 0,
                            },
                            end: {
                                column: item.symbol?.location?.end?.column || 0,
                                line: item.symbol?.location?.end?.line || 0,
                            },
                        },
                    })
                );
            });
        }),
        setEntries(
            items: {
                symbol: GqlSymbolInformation;
                lastVisited: number;
            }[]
        ) {
            self.entries.clear();
            const filteredItems = items.filter(
                item => item.symbol.filePath !== ''
            );
            filteredItems.sort((a, b) => b.lastVisited - a.lastVisited);

            filteredItems.forEach(item => {
                self.entries.push(
                    NavigationEntry.create({
                        filePath: item.symbol.filePath,
                        kind: item.symbol.kind,
                        name: item.symbol.name,
                        lastVisited: item.lastVisited,
                        location: {
                            start: {
                                column:
                                    item.symbol?.location?.start?.column || 0,
                                line: item.symbol?.location?.start?.line || 0,
                            },
                            end: {
                                column: item.symbol?.location?.end?.column || 0,
                                line: item.symbol?.location?.end?.line || 0,
                            },
                        },
                    })
                );
            });
        },
    }));

export default Workspace;
