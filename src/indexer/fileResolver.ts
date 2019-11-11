import { isAbsolute, resolve, dirname, sep, join } from "path";
import { existsSync, statSync } from "fs";
const supportedExtensions = ["js", "jsx", "ts", "tsx"];

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

export function findAbsoluteFilePathWhichExists(
  root: string,
  currentDirectory: string,
  originalPath: string,
  pathAliasMap: { [alias: string]: string }
) {
  // when a path is absolute
  if (isAbsolute(originalPath)) {
    if (existsSync(originalPath)) {
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

      const subWithIndex = tryResolvingWithIndexOrExtension(substitutedPath);
      if (subWithIndex) {
        return subWithIndex;
      }
    }
  }

  throw Error("path does not exist");
}
