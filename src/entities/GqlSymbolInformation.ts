import { ObjectType, Field } from "type-graphql";
import { Location } from "./Location";

@ObjectType()
export class GqlSymbolInformation {
  @Field({ nullable: true })
  name: string = "";

  @Field({ nullable: true })
  filePath: string = "";

  @Field(returns => Number, { nullable: true })
  kind: any | null = null;

  @Field(returns => Location, { nullable: true })
  location?: Location;
}
