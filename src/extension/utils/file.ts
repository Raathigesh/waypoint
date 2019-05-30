import { FileType } from "../../indexer/FileType";

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
