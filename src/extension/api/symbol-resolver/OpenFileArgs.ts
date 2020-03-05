import { ArgsType, Field, InputType } from "type-graphql";

@InputType()
export class Location {
  @Field(returns => Number, { nullable: true })
  startLine: number = 0;

  @Field(returns => Number, { nullable: true })
  startColumn: number = 0;

  @Field(returns => Number, { nullable: true })
  endLine: number = 0;

  @Field(returns => Number, { nullable: true })
  endColumn: number = 0;
}

@ArgsType()
export class OpenFileArgs {
  @Field(type => String, { nullable: true })
  path: string = "";

  @Field(returns => Location, { nullable: true })
  location: Location = {
    startColumn: 0,
    startLine: 0,
    endColumn: 0,
    endLine: 0
  };
}
