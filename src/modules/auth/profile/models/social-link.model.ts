import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({})
export class SocialLinkModel {
  @Field(() => ID)
  public id: string

  @Field(() => String)
  public title: string

  @Field(() => String)
  public url: string

  @Field(() => String)
  public userId: string

  @Field(() => Date)
  public createdAt: Date

  @Field(() => Date)
  public updatedAt: Date
}
