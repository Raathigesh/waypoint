import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class GqlProjectInfo {
  @Field({ nullable: true })
  separator: string = "";

  @Field({ nullable: true })
  root: string = "";
}
