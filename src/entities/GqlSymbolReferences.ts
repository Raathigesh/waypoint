import { ObjectType, Field } from 'type-graphql';
import { GqlSymbolInformation } from './GqlSymbolInformation';

@ObjectType()
export class GqlSymbolReferences {
    @Field(returns => [GqlSymbolInformation], { nullable: true })
    items: Array<GqlSymbolInformation> = [];

    @Field(returns => String, { nullable: true })
    errorMessage?: string;
}
