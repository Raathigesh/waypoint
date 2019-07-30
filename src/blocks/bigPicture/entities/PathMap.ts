import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class PathMap {
  @Field(returns => String)
  path: string = "";

  @Field(returns => String)
  mapsTo: string = "";
}
