import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class GqlIndexerStatus {
  @Field({ nullable: true })
  status: string = "";

  @Field({ nullable: true })
  totalFiles: number = 0;

  @Field({ nullable: true })
  indexedFileCount: number = 0;
}
