import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Subscription,
  Root
} from "type-graphql";
import { ContainerInstance, Service } from "typedi";
import Indexer from "../../../common/indexer/Indexer";
import { Usages } from "../entities/Usages";
import findAllUsage from "./queries/findAllUsage";
import { Usage } from "../entities/Usage";
import { basename } from "path";
import { PathMap } from "../entities/PathMap";

@Service()
@Resolver(Usages)
export default class UsagesResolver {
  constructor(
    private readonly container: ContainerInstance,
    private readonly indexer: Indexer
  ) {}

  @Query(returns => Usages)
  usage(@Arg("name") name: string, @Arg("source") source: string) {
    const usages = new Usages();
    const uses = findAllUsage(this.indexer, source, name);

    uses.forEach(use => {
      const usage = new Usage();
      usage.fileName = basename(use.path);
      usage.filePath = use.path;
      usages.usages.push(usage);
    });
    return usages;
  }
}
