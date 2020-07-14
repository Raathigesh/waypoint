import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class GqlProjectInfo {
    @Field({ nullable: true })
    separator: string = '';

    @Field({ nullable: true })
    root: string = '';

    @Field({ nullable: true })
    fontFamily: string = '';

    @Field({ nullable: true })
    fontSize: number = 0;
}
