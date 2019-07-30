import { ObjectType, Field } from "type-graphql";
import { Flake } from "../../../common/entities/Symbol";

@ObjectType()
export class Usage {
  @Field(returns => String)
  fileName: string = "";

  @Field(returns => String)
  filePath: string = "";
}
