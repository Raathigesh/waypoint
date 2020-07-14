import { types, flow, getEnv } from 'mobx-state-tree';
import { indexerStatus, startIndexing } from '../services';
import { PathMap } from './PathMap';
import { App } from './app';
import { GqlIndexerStatus } from 'entities/GqlIndexerStatus';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const IndexerFailure = types.model('IndexerFailure', {
    filePath: types.string,
    error: types.string,
});

export const IndexerStatus = types
    .model('IndexerStatus', {
        status: types.string,
        totalFiles: types.number,
        indexedFiles: types.number,
        failures: types.array(IndexerFailure),
    })
    .actions(self => {
        const getStatus = flow(function*() {
            const status: GqlIndexerStatus = yield indexerStatus();
            self.status = status.status;
            self.indexedFiles = status.indexedFileCount;
            self.totalFiles = status.totalFiles;
            self.failures.clear();

            status.failures.forEach(failure => {
                self.failures.push(
                    IndexerFailure.create({
                        filePath: failure.filePath,
                        error: failure.error,
                    })
                );
            });
        });

        const pollForStatus: () => Promise<any> = flow(function*() {
            const status: GqlIndexerStatus = yield indexerStatus();

            self.status = status.status;
            self.indexedFiles = status.indexedFileCount;
            self.totalFiles = status.totalFiles;
            self.failures.clear();
            status.failures.forEach(failure => {
                self.failures.push(
                    IndexerFailure.create({
                        filePath: failure.filePath,
                        error: failure.error,
                    })
                );
            });
            while (true && self.status === 'indexing') {
                yield sleep(500);
                yield pollForStatus();
            }
        });

        const initiateIndexing = flow(function*() {
            const env: {
                pathMap: typeof PathMap.Type;
                app: typeof App.Type;
            } = getEnv(self);

            startIndexing(
                env.pathMap.items.map(item => ({
                    alias: item.alias,
                    path: item.path,
                })),
                [...env.app.directories.values()]
            );
            self.status = 'indexing';
            pollForStatus();
        });

        return { getStatus, pollForStatus, initiateIndexing };
    });
