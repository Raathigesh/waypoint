import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Symbol {
  @Field()
  name: string = "";

  @Field()
  exportStatus: "default" | "named" | "none" = "none";

  @Field()
  filePath: string = "";
}
