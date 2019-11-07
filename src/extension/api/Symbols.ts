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
      root: process.env.projectRoot || ""
    };
    await this.indexer.parse(project);
    return Status.OK;
  }

  @Mutation(returns => SearchResult)
  public async search(@Arg("query") query: string) {
    const symbols: GqlSymbolInformation[] = [];
    try {
      const result = new SearchResult();
      result.items = this.indexer.search(query);
      return result;
    } catch (e) {
      const result = new SearchResult();
      result.errorMessage = e.stack;
      return result;
    }
  }

  @Query(returns => [GqlSymbolInformation])
  public async findReferences(@Args()
  {
    symbol
  }: GetReferencesArgs) {
    const results = this.indexer.findReferences(
      symbol.filePath || "",
      symbol.name || ""
    );
    return results;
  }
}
