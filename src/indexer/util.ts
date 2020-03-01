import { FileType } from "indexer/FileType";
import { sep } from "path";

export const getFileType = (path: string): FileType => {
  const extension = path.split(".").pop();
  if (extension === "js") {
    return "JS";
  } else if (extension === "ts") {
    return "TS";
  } else if (extension === "tsx") {
    return "TSX";
  } else if (extension === "jsx") {
    return "JSX";
  }
  return "UNSUPPORTED";
};

export function santizePath(root: string, path?: string = "") {
  return path
    .replace(root, "")
    .split(sep)
    .join("/");
}
