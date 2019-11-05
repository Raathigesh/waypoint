import { ArgsType, Field, InputType } from "type-graphql";

@InputType()
export class FindReferenceSymbol {
  @Field(returns => String, { nullable: true })
  kind: string | undefined = undefined;

  /**
   * The name of the symbol as returned from TS
   */
  @Field(returns => String, { nullable: true })
  name: string | undefined = undefined;

  /**
   * The kind of the symbol the symbol is contained in, as a ts.ScriptElementKind.
   * Is an empty string if the symbol has no container.
   */
  @Field(returns => String, { nullable: true })
  containerKind: string | undefined = undefined;

  /**
   * The file path of the file where the symbol is defined in, relative to the workspace rootPath.
   */
  @Field(returns => String, { nullable: true })
  filePath: string | undefined = undefined;
}

@ArgsType()
export class GetReferencesArgs {
  @Field(type => FindReferenceSymbol)
  symbol: FindReferenceSymbol | undefined;
}
