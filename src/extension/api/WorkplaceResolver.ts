import { Resolver, Mutation, Arg, Query } from "type-graphql";
const Conf = require("conf");
import { Service } from "typedi";

@Resolver()
@Service()
export default class WorkplaceResolver {
  private conf = new Conf({
    projectName: "Insight",
    projectVersion: 1
  });

  getKeyForPathMaps() {
    return `pathMaps.${process.env.projectRoot}`;
  }

  @Mutation(returns => String)
  public setPathMap(@Arg("value") value: string) {
    this.conf.set(this.getKeyForPathMaps(), value);
    return "";
  }

  @Query(returns => String)
  public getPathMap() {
    return this.conf.get(this.getKeyForPathMaps()) || "";
  }
}
