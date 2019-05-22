import * as vscode from "vscode";
import { Resolver, Query, Mutation } from "type-graphql";
import { Service, ContainerInstance } from "typedi";
import { Symbol } from "../../../entities/Symbol";
import Indexer from "../../indexer/Indexer";
import Project from "../../indexer/Project";

@Service()
@Resolver(Symbol)
export default class SymbolsResolver {
  constructor(
    private readonly container: ContainerInstance,
    private readonly indexer: Indexer
  ) {}

  @Mutation(returns => String)
  public async reindex() {
    const project: Project = {
      root: vscode.workspace.rootPath || ""
    };
    await this.indexer.parse(project);
    return "OK";
  }

  @Query(returns => [Symbol])
  public getIndexedSymbols() {
    const symbols: Symbol[] = [];

    Object.entries(this.indexer.files).forEach(([path, file]) => {
      file.classes.forEach(classSymbol => {
        symbols.push({
          exportStatus: classSymbol.exportStatus,
          filePath: path,
          name: classSymbol.name
        });
      });

      file.functions.forEach(functionSymbol => {
        symbols.push({
          exportStatus: functionSymbol.exportStatus,
          filePath: path,
          name: functionSymbol.name
        });
      });
    });

    return symbols;
  }
}
