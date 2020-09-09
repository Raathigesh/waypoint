import { types, flow } from 'mobx-state-tree';
import { getAllOpenTextDocuments } from 'ui/store/services/workspace';

const WorkspaceDoc = types
    .model('WorkspaceDoc', {
        path: types.string,
        activeSymbol: types.string,
        isActive: types.boolean,
    })
    .actions(self => ({
        setActiveSymbol: (symbol: string) => {
            self.activeSymbol = symbol;
        },
    }));

const Workspace = types
    .model('Workspace', {
        docs: types.array(WorkspaceDoc),
    })
    .views(self => ({
        getDocForPath(path: string) {
            return self.docs.find(doc => doc.path === path);
        },
    }))
    .actions(self => ({
        afterCreate: flow(function*() {
            const openEditors = yield getAllOpenTextDocuments();
            openEditors.forEach((editor: string) => {
                const doc = WorkspaceDoc.create({
                    path: editor,
                    activeSymbol: '',
                    isActive: false,
                });

                self.docs.push(doc);
            });
        }),
        fetchOpenDocuments: flow(function*() {
            const openEditors = yield getAllOpenTextDocuments();
            self.docs.clear();
            openEditors.forEach((editor: string) => {
                const doc = WorkspaceDoc.create({
                    path: editor,
                    activeSymbol: '',
                    isActive: false,
                });

                self.docs.push(doc);
            });
        }),
        setActiveDocAndSymbol: (file: string, symbol: string) => {
            const doc = self.docs.find(doc => doc.path === file);

            if (doc) {
                doc.setActiveSymbol(symbol);
            }
        },
    }));

export default Workspace;
