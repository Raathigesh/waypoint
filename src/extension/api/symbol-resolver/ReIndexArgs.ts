import { ArgsType, Field, InputType } from "type-graphql";

@InputType()
export class PathMapItem {
  @Field(returns => String, { nullable: true })
  alias: string | undefined = undefined;

  @Field(returns => String, { nullable: true })
  path: string | undefined = undefined;
}

@ArgsType()
export class ReIndexArgs {
  @Field(type => [PathMapItem], { nullable: true })
  items?: PathMapItem[];

  @Field(returns => [String], { nullable: true })
  directories: string[] = [];
}
