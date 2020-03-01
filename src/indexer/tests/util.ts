import { sep } from "path";

export function santizePath(root: string, path?: string = "") {
  return path
    .replace(root, "")
    .split(sep)
    .join("/");
}
