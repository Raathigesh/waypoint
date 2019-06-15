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
import Indexer from "../../../indexer/Indexer";
import Project from "../../../indexer/Project";
import {
  Events,
  SearchQueryChangeEvent
} from "../../../extension/api/eventSystem/Events";
import { pubSub } from "../../../extension/api/eventSystem/pubSub";
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
      file.classes.forEach(classSymbol => {
        if (selector(path)) {
          symbols.push({
            exportStatus: classSymbol.exportStatus,
            filePath: path,
            name: classSymbol.name,
            type: "class"
          });
        }
      });

      file.functions.forEach(functionSymbol => {
        if (selector(path)) {
          symbols.push({
            exportStatus: functionSymbol.exportStatus,
            filePath: path,
            name: functionSymbol.name,
            type: "function"
          });
        }
      });

      file.variables.forEach(variableSymbol => {
        if (selector(path)) {
          symbols.push({
            exportStatus: variableSymbol.exportStatus,
            filePath: path,
            name: variableSymbol.name,
            type: "variable"
          });
        }
      });
    });

    const result = new SearchResult();
    result.items = symbols;

    return result;
  }
}
