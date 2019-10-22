import { ObjectType, Field } from "type-graphql";
import { Flake } from "./Symbol";

@ObjectType()
export class SearchResult {
  @Field(returns => [Flake], { nullable: true })
  items: Array<Flake> = [];

  @Field(returns => String, { nullable: true })
  errorMessage?: string;
}
