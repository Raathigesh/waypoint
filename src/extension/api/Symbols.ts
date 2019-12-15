import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Subscription,
  Root,
  Args
} from "type-graphql";
import { ContainerInstance, Service, Inject } from "typedi";
import Indexer from "indexer/Indexer";
import Project from "indexer/Project";
import { pubSub } from "common/pubSub";
import { Status } from "./Status";
import { SearchResult } from "../../entities/SearchResult";
import {
  GqlSymbolInformation,
  GqlMarkers
} from "entities/GqlSymbolInformation";
import { WorkspaceSymbolResponse } from "./types";
import { GetReferencesArgs } from "./GetReferenceArgs";
import ESModuleItem from "indexer/ESModuleItem";
import { ReIndexArgs } from "./ReIndexArgs";
import { sep } from "path";
import * as vscode from "vscode";

@Service()
@Resolver(SearchResult)
export default class SymbolsResolver {
  private activeEditorPath: string | undefined;

  constructor(
    private readonly container: ContainerInstance,
    private readonly indexer: Indexer
  ) {
    vscode.window.onDidChangeActiveTextEditor(e => {
      this.activeEditorPath = e?.document.fileName;
    });
  }

  @Query(returns => SearchResult)
  results() {
    return new SearchResult();
  }

  @Mutation(returns => String)
  public async reindex(@Args() { items }: ReIndexArgs) {
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
      pathAlias
    };
    await this.indexer.parse(project);
    return Status.OK;
  }

  @Query(returns => String)
  public indexingStatus() {
    return this.indexer.status;
  }

  @Query(returns => String)
  public separator() {
    return sep;
  }

  @Mutation(returns => SearchResult)
  public async search(@Arg("query") query: string) {
    try {
      const result = new SearchResult();
      const items = this.indexer.search(query);
      result.items = items.map(({ obj }: { obj: ESModuleItem }) => {
        const item = new GqlSymbolInformation();
        item.filePath = obj.path;
        item.kind = obj.kind;
        item.name = obj.name;
        item.id = obj.id;
        item.code = obj.code;

        return item;
      });
      return result;
    } catch (e) {
      const result = new SearchResult();
      result.errorMessage = e.stack;
      return result;
    }
  }

  @Query(returns => GqlSymbolInformation)
  public async getSymbolWithMarkers(
    @Arg("path") path: string,
    @Arg("name") name: string
  ) {
    return this.indexer.getSymbolWithMarkers(path, name);
  }

  @Query(returns => [GqlSymbolInformation])
  public async findReferences(
    @Args()
    { symbol }: GetReferencesArgs
  ) {
    if (!symbol) {
      return [];
    }

    return this.indexer
      .findReferences(symbol.filePath || "", symbol.name || "")
      .map(reference => ({ ...reference, filePath: reference.path }));
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
          item.code = symbol.code;

          return item;
        });
    }
    return [];
  }
}
