import Project from "./Project";
import SourceFile from "./SourceFile";

export default class Indexer {
  public files: { [path: string]: SourceFile } = {};

  public parse(project: Project) {}
}
