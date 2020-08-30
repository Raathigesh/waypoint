import { types, flow } from 'mobx-state-tree';
import { getAllOpenTextDocuments } from 'ui/store/services/workspace';

const Workspace = types
    .model('Bookmarks', {
        textDocuments: types.array(types.string),
    })
    .actions(self => ({
        afterCreate: flow(function*() {
            const openEditors = yield getAllOpenTextDocuments();
            self.textDocuments.push(...openEditors);
        }),
        fetchOpenDocuments: flow(function*() {
            const openEditors = yield getAllOpenTextDocuments();
            self.textDocuments.push(...openEditors);
        }),
    }));

export default Workspace;
