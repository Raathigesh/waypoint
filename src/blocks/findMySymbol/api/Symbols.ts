import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Subscription,
  Root
} from "type-graphql";
import { ContainerInstance, Service } from "typedi";
import * as vscode from "vscode";
import { Flake } from "../entities/Symbol";
import Indexer from "../../../common/indexer/Indexer";
import Project from "../../../common/indexer/Project";
import { Events, SearchQueryChangeEvent } from "./Events";
import { pubSub } from "../../../extension/api/pubSub";
import { Status } from "../../../extension/api/Status";
import { SearchResult } from "../entities/SearchResult";

@Service()
@Resolver(SearchResult)
export default class SymbolsResolver {
  constructor(
    private readonly container: ContainerInstance,
    private readonly indexer: Indexer
  ) {}

  @Query(returns => SearchResult)
  results() {
    return new SearchResult();
  }

  @Mutation(returns => String)
  public async reindex() {
    const project: Project = {
      root: vscode.workspace.rootPath || ""
    };
    await this.indexer.parse(project);
    return Status.OK;
  }

  @Mutation(returns => String)
  public search(
    @Arg("query") query: string,
    @Arg("selector") selector: string
  ) {
    const event: SearchQueryChangeEvent = {
      query,
      selector
    };
    pubSub.publish(Events.SEARCH_QUERY_CHANGE, event);
    return Status.OK;
  }

  @Subscription(returns => SearchResult, {
    topics: [Events.SEARCH_QUERY_CHANGE]
  })
  public searchResults(@Root() event: SearchQueryChangeEvent) {
    const symbols: Flake[] = [];

    const selector = eval(`(${event.selector})`);

    Object.entries(this.indexer.files).forEach(([path, file]) => {
      const selectorResult = selector(path);
      file.classes
        .filter(item => item.name.includes(event.query))
        .forEach(classSymbol => {
          if (selectorResult.include) {
            symbols.push({
              exportStatus: classSymbol.exportStatus,
              filePath: path,
              name: classSymbol.name,
              type: "class",
              category: selectorResult.category
            });
          }
        });

      file.functions
        .filter(item => item.name.includes(event.query))
        .forEach(functionSymbol => {
          if (selectorResult.include) {
            symbols.push({
              exportStatus: functionSymbol.exportStatus,
              filePath: path,
              name: functionSymbol.name,
              type: "function",
              category: selectorResult.category
            });
          }
        });

      file.variables
        .filter(item => item.name.includes(event.query))
        .forEach(variableSymbol => {
          if (selectorResult.include) {
            symbols.push({
              exportStatus: variableSymbol.exportStatus,
              filePath: path,
              name: variableSymbol.name,
              type: "variable",
              category: selectorResult.category
            });
          }
        });
    });

    const result = new SearchResult();
    result.items = symbols;

    return result;
  }
}
