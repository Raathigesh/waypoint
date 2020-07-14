import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class GqlIndexerFailure {
    @Field({ nullable: true })
    filePath: string = '';

    @Field({ nullable: true })
    error: string = '';
}

@ObjectType()
export class GqlIndexerStatus {
    @Field({ nullable: true })
    status: string = '';

    @Field({ nullable: true })
    totalFiles: number = 0;

    @Field({ nullable: true })
    indexedFileCount: number = 0;

    @Field(returns => [GqlIndexerFailure], { nullable: true })
    failures: GqlIndexerFailure[] = [];
}
