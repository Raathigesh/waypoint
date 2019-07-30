import { ObjectType, Field } from "type-graphql";

import { Usage } from "./Usage";

@ObjectType()
export class Usages {
  @Field(returns => [Usage])
  usages: Usage[] = [];
}
