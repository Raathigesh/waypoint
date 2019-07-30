import Indexer from "common/indexer/Indexer";
import SourceFile from "common/indexer/SourceFile";

export default function findAllUsage(
  indexer: Indexer,
  source: string,
  name: string
) {
  const result: SourceFile[] = [];
  Object.entries(indexer.files).forEach(([path, file]) => {
    if (file.isImportingSymbol(name, source)) {
      result.push(file);
    }
  });
  return result;
}
