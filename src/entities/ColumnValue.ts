import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ColumnValue {
  @Field({ nullable: true })
  key: string = "";

  @Field({ nullable: true })
  properties: string = "";
}
