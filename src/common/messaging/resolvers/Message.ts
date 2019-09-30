import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Message {
  @Field(returns => String)
  id: string = "";

  @Field(returns => String)
  payload: string = "";
}
