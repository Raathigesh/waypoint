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
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { WorkspaceSymbolResponse } from "./types";
import { GetReferencesArgs } from "./GetReferenceArgs";
import ESModuleItem from "indexer/ESModuleItem";

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
      root: process.env.projectRoot || "",
      pathAlias: { "app-simple-plans": "./app-simple-plans" }
    };
    await this.indexer.parse(project);
    return Status.OK;
  }

  @Query(returns => String)
  public indexingStatus() {
    return this.indexer.status;
  }

  @Mutation(returns => SearchResult)
  public async search(@Arg("query") query: string) {
    const symbols: GqlSymbolInformation[] = [];
    try {
      const result = new SearchResult();
      const items = this.indexer.search(query);
      result.items = items.map(({ obj }: { obj: ESModuleItem }) => {
        const item = new GqlSymbolInformation();
        item.filePath = obj.path;
        item.kind = obj.kind;
        item.name = obj.name;
        item.id = obj.id;

        return item;
      });
      return result;
    } catch (e) {
      const result = new SearchResult();
      result.errorMessage = e.stack;
      return result;
    }
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
}
