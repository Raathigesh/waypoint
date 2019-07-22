import { ObjectType, Field } from "type-graphql";
import { Flake } from "./Symbol";

@ObjectType()
export class SearchResult {
  @Field(returns => [Flake])
  items: Array<Flake> = [];

  @Field(returns => [String])
  categories: Array<String> = [];
}
