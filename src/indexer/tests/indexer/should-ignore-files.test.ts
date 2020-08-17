import Indexer from 'indexer/Indexer';
import { sep } from 'path';

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
        const ignoreFunc = indexer.getIgnoreFunc([], []);

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}node_modules${sep}index.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(true);
    });

    it('should include files if no directories provided', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc([], []);

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}index.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(false);
    });

    it('should exclude files which are outside of the provided directory', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [`c:${sep}dev${sep}waypoint${sep}src${sep}`],
            []
        );

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}test.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(true);
    });

    it('should include files which are inside of the provided directory', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [`c:${sep}dev${sep}waypoint${sep}src${sep}`],
            []
        );

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}test.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(false);
    });

    it('should include files which are inside of the provided directories', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [
                `c:${sep}dev${sep}waypoint${sep}src${sep}`,
                `c:${sep}dev${sep}waypoint${sep}tests${sep}`,
            ],
            []
        );

        const shouldIgnore1 = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}components${sep}view.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore1).toBe(false);

        const shouldIgnore2 = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}tests${sep}view.test.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore2).toBe(false);

        const shouldIgnore3 = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}tests${sep}node_modules${sep}view.test.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore3).toBe(true);
    });

    it('should include folders', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [`c:${sep}dev${sep}waypoint${sep}src${sep}`],
            []
        );

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}`,
            getMockFSStat(false, true)
        );
        expect(shouldIgnore).toBe(false);
    });

    it('should include nested folders', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [`c:${sep}dev${sep}waypoint${sep}src${sep}`],
            []
        );

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}components`,
            getMockFSStat(false, true)
        );
        expect(shouldIgnore).toBe(false);
    });

    it('should not include files from excluded folders', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [`c:${sep}dev${sep}waypoint${sep}src${sep}`],
            [`c:${sep}dev${sep}waypoint${sep}dist`]
        );

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}dist${sep}index.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(true);
    });

    it('should not include files from nested excluded folders', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [`c:${sep}dev${sep}waypoint${sep}src${sep}`],
            [`c:${sep}dev${sep}waypoint${sep}src${sep}dist`]
        );

        const shouldIgnore1 = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}dist${sep}index.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore1).toBe(true);

        const shouldIgnore2 = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}index.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore2).toBe(false);
    });

    it('should ignore files if the included directory is also presents in the excluded directory', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [`c:${sep}dev${sep}waypoint${sep}src${sep}`],
            [`c:${sep}dev${sep}waypoint${sep}src${sep}`]
        );

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}src${sep}index.js`,
            getMockFSStat(true, false)
        );
        expect(shouldIgnore).toBe(true);
    });

    it('should not ignore a parent directory when a child directory is included', () => {
        const indexer = new Indexer();
        const ignoreFunc = indexer.getIgnoreFunc(
            [
                `c:${sep}dev${sep}waypoint${sep}packages${sep}frontend${sep}view${sep}sidebar`,
            ],
            []
        );

        const shouldIgnore = ignoreFunc(
            `c:${sep}dev${sep}waypoint${sep}packages`,
            getMockFSStat(false, true)
        );
        expect(shouldIgnore).toBe(false);
    });
});
