import {
    isAbsolute,
    resolve,
    dirname,
    sep,
    join,
    normalize,
    relative,
} from 'path';
import { existsSync, statSync, lstatSync } from 'fs';
const supportedExtensions = ['js', 'jsx', 'ts', 'tsx'];

export function tryResolvingWithIndexOrExtension(originalPath: string) {
    for (const extension of supportedExtensions) {
        const pathWithExt = `${originalPath}.${extension}`;
        if (existsSync(pathWithExt)) {
            return pathWithExt;
        }
    }

    for (const extension of supportedExtensions) {
        const pathWithExt = join(originalPath, `index.${extension}`);
        if (existsSync(pathWithExt)) {
            return pathWithExt;
        }
    }

    return null;
}

function convertPathToES6ImportPath(path: string) {
    const regexSep = sep === '\\' ? '\\\\' : sep;
    return path.replace(new RegExp(regexSep, 'g'), '/');
}

export function getAliasPathForAbsolutePath(
    root: string,
    absolutePath: string,
    currentFilePath: string,
    pathAliasMap: { [alias: string]: string }
) {
    let substitutedPath = normalize(absolutePath);
    Object.entries(pathAliasMap).forEach(([alias, path]) => {
        const normalizedPath = normalize(join(root, path));
        if (absolutePath.startsWith(normalizedPath)) {
            const replacedPath = absolutePath.replace(normalizedPath, '');
            if (!replacedPath.startsWith(sep)) {
                alias = `${alias}/`;
            }
            substitutedPath = join(alias, replacedPath);
        }

        substitutedPath = convertPathToES6ImportPath(substitutedPath);
    });

    ['index.js', 'index.tsx', 'index.ts', 'index.jsx'].forEach(indexFile => {
        if (substitutedPath.endsWith(indexFile)) {
            substitutedPath = substitutedPath.replace(`${sep}${indexFile}`, '');
        }
    });

    ['.js', '.tsx', '.ts', '.jsx'].forEach(extension => {
        if (substitutedPath.endsWith(extension)) {
            substitutedPath = substitutedPath.replace(`${extension}`, '');
        }
    });

    if (normalize(absolutePath) === substitutedPath) {
        return convertPathToES6ImportPath(
            relative(dirname(currentFilePath), absolutePath)
        );
    }
    return substitutedPath;
}

export function findAbsoluteFilePathWhichExists(
    root: string,
    currentDirectory: string,
    originalPath: string,
    pathAliasMap: { [alias: string]: string }
) {
    // when a path is absolute
    if (isAbsolute(originalPath)) {
        if (
            existsSync(originalPath) &&
            !lstatSync(originalPath).isDirectory()
        ) {
            return originalPath;
        }

        const withIndex = tryResolvingWithIndexOrExtension(originalPath);
        if (withIndex) {
            return withIndex;
        }
    } else {
        // path is relative
        const absolutePath = resolve(currentDirectory, originalPath);
        if (existsSync(absolutePath)) {
            return absolutePath;
        } else {
            const withIndex = tryResolvingWithIndexOrExtension(absolutePath);
            if (withIndex) {
                return withIndex;
            }

            let substitutedPath = originalPath;
            Object.entries(pathAliasMap).forEach(([alias, path]) => {
                if (originalPath.startsWith(`${alias}/`)) {
                    substitutedPath = originalPath.replace(alias, path);
                    substitutedPath = resolve(root, substitutedPath);
                }
            });

            const subWithIndex = tryResolvingWithIndexOrExtension(
                substitutedPath
            );
            if (subWithIndex) {
                return subWithIndex;
            }
        }
    }

    throw Error('path does not exist');
}
