import { ObjectType, Field } from "type-graphql";
import { GqlSymbolInformation } from "./GqlSymbolInformation";

@ObjectType()
export class GqlFile {
  @Field({ nullable: true })
  filePath: string = "";

  @Field(returns => [GqlSymbolInformation], { nullable: true })
  symbols: GqlSymbolInformation[] = [];
}
