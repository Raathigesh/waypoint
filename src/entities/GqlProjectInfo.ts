import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class ProjectInfo {
  @Field({ nullable: true })
  separator: string = "";

  @Field({ nullable: true })
  root: string = "";
}
