import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Position {
  @Field({ nullable: true })
  line: number = 0;

  @Field({ nullable: true })
  column: number = 0;
}

@ObjectType()
export class Location {
  @Field(returns => Position, { nullable: true })
  start?: Position;

  @Field(returns => Position, { nullable: true })
  end?: Position;
}
