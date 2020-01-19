import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Args,
  Subscription,
  Root
} from "type-graphql";
import { ContainerInstance, Service } from "typedi";
import Indexer from "indexer/Indexer";
import Project from "indexer/Project";
import { GqlSearchResult } from "../../../entities/GqlSearchResult";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import ESModuleItem from "indexer/ESModuleItem";
import { ReIndexArgs } from "./ReIndexArgs";
import { sep } from "path";
import * as vscode from "vscode";
import { GqlProjectInfo } from "entities/GqlProjectInfo";
import { existsSync } from "fs";
import { GqlFile } from "entities/GqlFile";
import { pubSub } from "common/pubSub";
import { GqlLocation } from "entities/GqlLocation";

@Service()
@Resolver(GqlSearchResult)
export default class SymbolsResolver {
  private activeEditorPath: string | undefined;
  private activeEditor: vscode.TextEditor | undefined;

  constructor(
    private readonly container: ContainerInstance,
    private readonly indexer: Indexer
  ) {
    vscode.window.onDidChangeActiveTextEditor(e => {
      if (e && existsSync(e.document.fileName)) {
        this.activeEditorPath = e.document.fileName;
        this.activeEditor = e;
      }
    });
    vscode.workspace.onDidSaveTextDocument(e => {
      indexer.indexFile(e.fileName);
    });
  }

  @Query(returns => GqlSearchResult)
  results() {
    return new GqlSearchResult();
  }

  @Mutation(returns => String)
  public async reindex(@Args() { items, directories }: ReIndexArgs) {
    let pathAlias = {};
    if (items) {
      pathAlias = items.reduce(
        (acc, item) => ({
          ...acc,
          [item.alias || ""]: item.path
        }),
        {}
      );
    }

    const project: Project = {
      root: process.env.projectRoot || "",
      pathAlias,
      directories
    };
    await this.indexer.parse(project);
    return "OK";
  }

  @Query(returns => String)
  public indexingStatus() {
    return this.indexer.status;
  }

  @Query(returns => GqlProjectInfo)
  public project() {
    const info = new GqlProjectInfo();
    info.separator = sep;
    info.root = process.env.projectRoot || "";
    info.fontFamily =
      vscode.workspace.getConfiguration("editor").get("fontFamily") || "";
    info.fontSize =
      vscode.workspace.getConfiguration("editor").get("fontSize") || 0;
    return info;
  }

  @Mutation(returns => GqlSearchResult)
  public async search(@Arg("query") query: string) {
    try {
      const result = new GqlSearchResult();
      const items = this.indexer.search(query);
      result.items = items.map(({ obj }: { obj: ESModuleItem }) => {
        const item = new GqlSymbolInformation();
        item.filePath = obj.path;
        item.kind = obj.kind;
        item.name = obj.name;
        item.id = obj.id;
        item.location = obj.location;

        return item;
      });
      return result;
    } catch (e) {
      const result = new GqlSearchResult();
      result.errorMessage = e.stack;
      return result;
    }
  }

  @Mutation(returns => [String])
  public async searchFile(@Arg("query") query: string) {
    return this.indexer.searchFile(query).map((item: any) => item.target);
  }

  @Query(returns => GqlSymbolInformation)
  public async getSymbolWithMarkers(
    @Arg("path") path: string,
    @Arg("name") name: string
  ) {
    const symbol = this.indexer.getSymbolWithMarkers(path, name);

    const item = new GqlSymbolInformation();
    if (symbol) {
      item.filePath = symbol.path;
      item.kind = symbol.kind;
      item.name = symbol.name;
      item.id = symbol.id;
      item.markers = symbol.markers;
      item.location = symbol.location;
    }

    return item;
  }

  @Query(returns => [GqlSymbolInformation])
  public async getSymbolsForActiveFile() {
    if (this.activeEditorPath) {
      return this.indexer
        .getSymbolsForPath(this.activeEditorPath)
        .map((symbol: ESModuleItem) => {
          const item = new GqlSymbolInformation();
          item.filePath = symbol.path;
          item.kind = symbol.kind;
          item.name = symbol.name;
          item.id = symbol.id;
          return item;
        });
    }
    return [];
  }

  @Query(returns => GqlFile)
  public async getActiveFile() {
    const gqlFile = new GqlFile();
    if (!this.activeEditorPath) {
      return gqlFile;
    }

    const file = this.indexer.files[this.activeEditorPath];
    if (file) {
      gqlFile.filePath = file.path;
      gqlFile.symbols = file.symbols.map(symbol => {
        const item = new GqlSymbolInformation();
        item.filePath = symbol.path;
        item.kind = symbol.kind;
        item.name = symbol.name;
        item.id = symbol.id;
        return item;
      });
    }

    return gqlFile;
  }

  @Query(returns => GqlSymbolInformation)
  public async getActiveSymbolForFile() {
    const item = new GqlSymbolInformation();
    if (this.activeEditorPath && this.activeEditor?.selection.active) {
      const activeFile = this.indexer.files[this.activeEditorPath];
      const location: GqlLocation = {
        start: {
          line: this.activeEditor?.selection.active.line,
          column: this.activeEditor?.selection.active.character
        },
        end: {
          line: this.activeEditor?.selection.active.line,
          column: this.activeEditor?.selection.active.character
        }
      };
      const symbol = activeFile.getSymbolInPosition(location);
      if (symbol) {
        item.filePath = symbol.path;
        item.kind = symbol.kind;
        item.name = symbol.name;
        item.id = symbol.id;
      }
    }
    return item;
  }

  @Query(returns => GqlFile)
  public async getFile(@Arg("path") path: string) {
    const gqlFile = new GqlFile();
    const file = this.indexer.files[path];
    if (file) {
      gqlFile.filePath = path;
      gqlFile.symbols = file.symbols.map(symbol => {
        const item = new GqlSymbolInformation();
        item.filePath = symbol.path;
        item.kind = symbol.kind;
        item.name = symbol.name;
        item.id = symbol.id;
        return item;
      });
    }

    return gqlFile;
  }

  @Query(returns => String)
  public async getCode(@Arg("path") path: string, @Arg("id") id: string) {
    return this.indexer.getCode(path, id);
  }

  @Subscription(() => String, {
    topics: ["js-bubbles.addFile", "js-bubbles.addSymbol"]
  })
  events(@Root() eventName: string) {
    return eventName;
  }
}
