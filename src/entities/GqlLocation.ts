import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class GqlPosition {
  @Field({ nullable: true })
  line: number = 0;

  @Field({ nullable: true })
  column: number = 0;
}

@ObjectType()
export class GqlLocation {
  @Field(returns => GqlPosition, { nullable: true })
  start?: GqlPosition;

  @Field(returns => GqlPosition, { nullable: true })
  end?: GqlPosition;
}
