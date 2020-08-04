import Indexer from 'indexer/Indexer';

const getMockFSStat = (isFile: boolean, isDirectory: boolean) => {
    return {
        isFile: () => isFile,
        isDirectory: () => isDirectory,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false,
        dev: 0,
        ino: 0,
        mode: 0,
        nlink: 0,
        uid: 0,
        gid: 0,
        rdev: 0,
        size: 0,
        blksize: 0,
        blocks: 0,
        atimeMs: 0,
        mtimeMs: 0,
        ctimeMs: 0,
        birthtimeMs: 0,
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
    };
};

describe('Indexer ignore func', () => {
    it('should ignore node_modules folder', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc([]);

        const shouldIgnore = ignoreFunc(
            'c:/dev/waypoint/node_modules/index.js',
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(true);
    });

    it('should include files if no directories provided', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc([]);

        const shouldIgnore = ignoreFunc(
            'c:/dev/waypoint/index.js',
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(false);
    });

    it('should exclude files which are outside of the provided directory', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(['c:/dev/waypoint/src/']);

        const shouldIgnore = ignoreFunc(
            'c:/dev/waypoint/test.js',
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(true);
    });

    it('should include files which are inside of the provided directory', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(['c:/dev/waypoint/src/']);

        const shouldIgnore = ignoreFunc(
            'c:/dev/waypoint/src/test.js',
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(false);
    });

    it('should include files which are inside of the provided directories', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc([
            'c:/dev/waypoint/src/',
            'c:/dev/waypoint/tests/',
        ]);

        const shouldIgnore1 = ignoreFunc(
            'c:/dev/waypoint/src/components/view.js',
            getMockFSStat(true, false)
        );
        expect(shouldIgnore1).toBe(false);

        const shouldIgnore2 = ignoreFunc(
            'c:/dev/waypoint/src/tests/view.test.js',
            getMockFSStat(true, false)
        );
        expect(shouldIgnore2).toBe(false);

        const shouldIgnore3 = ignoreFunc(
            'c:/dev/waypoint/src/tests/node_modules/view.test.js',
            getMockFSStat(true, false)
        );
        expect(shouldIgnore3).toBe(true);
    });
});
