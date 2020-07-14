import { types } from 'mobx-state-tree';
import { DocumentLocation } from '../DocumentLocation';

export const Bookmark = types.model('Bookmark', {
    filePath: types.string,
    name: types.string,
    kind: types.string,
    location: types.maybeNull(DocumentLocation),
});
