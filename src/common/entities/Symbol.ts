import { ObjectType, Field } from "type-graphql";
import { Location } from "./Location";

export type FlakeType = "function" | "variable" | "class" | "unknown";

@ObjectType()
export class Flake {
  @Field({ nullable: true })
  name: string = "";

  @Field({ nullable: true })
  exportStatus: string = "none";

  @Field({ nullable: true })
  filePath: string = "";

  @Field({ nullable: true })
  type: FlakeType = "unknown";

  @Field({ nullable: true })
  category: string = "";

  @Field(returns => Location, { nullable: true })
  location?: Location;
}
