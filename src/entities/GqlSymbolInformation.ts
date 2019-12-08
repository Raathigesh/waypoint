import { ObjectType, Field } from "type-graphql";
import { Location } from "./Location";

@ObjectType()
export class GqlMarkers {
  @Field(returns => Location, { nullable: true })
  location?: Location;

  @Field({ nullable: true })
  filePath: string = "";

  @Field({ nullable: true })
  name: string = "";
}

@ObjectType()
export class GqlSymbolInformation {
  @Field({ nullable: true })
  id: string = "";

  @Field({ nullable: true })
  name: string = "";

  @Field({ nullable: true })
  filePath: string = "";

  @Field(returns => String, { nullable: true })
  kind: any | null = null;

  @Field(returns => Location, { nullable: true })
  location?: Location;

  @Field({ nullable: true })
  code: string = "";

  @Field(returns => [GqlMarkers], { nullable: true })
  markers?: GqlMarkers[] = [];
}
