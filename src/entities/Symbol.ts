import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Symbol {
  @Field({ nullable: true })
  name: string = "";

  @Field({ nullable: true })
  exportStatus: string = "none";

  @Field({ nullable: true })
  filePath: string = "";
}
