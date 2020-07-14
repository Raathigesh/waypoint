import { types, flow, applySnapshot } from 'mobx-state-tree';
import * as nanoid from 'nanoid';
import { getProjectInfo } from '../services';
import { GqlProjectInfo } from 'entities/GqlProjectInfo';
import { getDirectories, setDirectories } from '../services/config';

export const App = types
    .model('App', {
        separator: types.string,
        root: types.string,
        directories: types.map(types.string),
    })
    .actions(self => {
        const afterCreate = flow(function*() {
            const project: GqlProjectInfo = yield getProjectInfo();

            self.separator = project.separator;
            self.root = project.root;

            const directories: string[] = yield getDirectories();
            directories.forEach(directory => {
                self.directories.set(nanoid(), directory);
            });
        });

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
            addDirectory,
            changeDirectory,
            removeDirectory,
        };
    });
