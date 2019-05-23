import { ObjectType, Field } from "type-graphql";
import { Symbol } from "./Symbol";

@ObjectType()
export class SearchResult {
  @Field(returns => [Symbol])
  items: Array<Symbol> = [];
}
