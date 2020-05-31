import { isAbsolute, resolve, dirname, sep, join, normalize } from "path";
import { existsSync, statSync, lstatSync } from "fs";
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

export function getAliasPathForAbsolutePath(
  root: string,
  absolutePath: string,
  pathAliasMap: { [alias: string]: string }
) {
  let substitutedPath = normalize(absolutePath);
  Object.entries(pathAliasMap).forEach(([alias, path]) => {
    const normalizedPath = normalize(join(root, path));
    if (absolutePath.startsWith(normalizedPath)) {
      substitutedPath = absolutePath.replace(normalizedPath, alias);
    }
    const regexSep = sep === "\\" ? "\\\\" : sep;
    substitutedPath = substitutedPath.replace(new RegExp(regexSep, "g"), "/");
    if (substitutedPath.endsWith("index.js")) {
      substitutedPath = substitutedPath.replace(`${sep}index.js`, "");
    }
  });
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
    if (existsSync(originalPath) && !lstatSync(originalPath).isDirectory()) {
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
