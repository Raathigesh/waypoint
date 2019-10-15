import { ObjectType, Field } from "type-graphql";
import { Location } from "./Location";
import { ColumnValue } from "./ColumnValue";

export type FlakeType = "function" | "variable" | "class" | "unknown";

@ObjectType()
export class Flake {
  @Field({ nullable: true })
  id: string = "";

  @Field({ nullable: true })
  name: string = "";

  @Field({ nullable: true })
  exportStatus: string = "none";

  @Field({ nullable: true })
  filePath: string = "";

  @Field({ nullable: true })
  type: FlakeType = "unknown";

  @Field(returns => Location, { nullable: true })
  location?: Location;

  @Field(returns => [ColumnValue], { nullable: true })
  columnValues: ColumnValue[] = [];
}
