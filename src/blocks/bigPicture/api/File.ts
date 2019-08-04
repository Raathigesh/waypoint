import {
  Arg,
  Query,
  Resolver,
  Subscription,
  Mutation,
  Root
} from "type-graphql";
import { ContainerInstance, Service } from "typedi";
import Indexer from "../../../common/indexer/Indexer";
import { Usages } from "../entities/Usages";
import findAllUsage from "./queries/findAllUsage";
import { Usage } from "../entities/Usage";
import { basename } from "path";
import { Events, ActiveSymbolChangeEvent } from "./Events";
import { pubSub } from "common/api/pubSub";
import { Flake } from "common/entities/Symbol";

@Service()
@Resolver(Usages)
export default class UsagesResolver {
  constructor(private readonly indexer: Indexer) {}

  @Subscription(() => Flake, {
    topics: [Events.SUB_ACTIVE_SYMBOL_CHANGE]
  })
  activeSymbol(@Root() { path, line, column }: ActiveSymbolChangeEvent) {
    const file = this.indexer.files[path];
    const symbolInLocation = file.findSymbolInLocation(line, column);
    return symbolInLocation;
  }

  @Mutation(() => Number)
  resolveActiveSymbol(
    @Arg("line") line: number,
    @Arg("column") column: number,
    @Arg("path") path: string
  ) {
    pubSub.publish(Events.SUB_ACTIVE_SYMBOL_CHANGE, {
      path,
      line,
      column
    });
    return 0;
  }

  @Query(() => Usages)
  usage(
    @Arg("line") line: number,
    @Arg("column") column: number,
    @Arg("path") path: string
  ) {
    const file = this.indexer.files[path];
    const symbolInLocation = file.findSymbolInLocation(line, column);

    const usages = new Usages();

    if (symbolInLocation) {
      const uses = findAllUsage(this.indexer, path, symbolInLocation.name);
      uses.forEach(use => {
        const usage = new Usage();
        usage.fileName = basename(use.path);
        usage.filePath = use.path;
        usages.usages.push(usage);
      });
    }

    return usages;
  }
}
