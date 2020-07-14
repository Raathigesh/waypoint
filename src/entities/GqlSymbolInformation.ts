import { ObjectType, Field } from 'type-graphql';
import { GqlLocation } from './GqlLocation';

@ObjectType()
export class GqlMarkers {
    @Field(returns => GqlLocation, { nullable: true })
    location?: GqlLocation;

    @Field({ nullable: true })
    filePath: string = '';

    @Field({ nullable: true })
    name: string = '';

    @Field({ nullable: true })
    isFromDefaultImport?: boolean = false;
}

@ObjectType()
export class GqlSymbolInformation {
    @Field({ nullable: true })
    id: string = '';

    @Field({ nullable: true })
    name: string = '';

    @Field({ nullable: true })
    filePath: string = '';

    @Field(returns => String, { nullable: true })
    kind: any | null = null;

    @Field(returns => GqlLocation, { nullable: true })
    location?: GqlLocation;

    @Field({ nullable: true })
    code: string = '';

    @Field(returns => [GqlMarkers], { nullable: true })
    markers?: GqlMarkers[] = [];
}
