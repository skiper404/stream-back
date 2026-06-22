import { Field, ID, ObjectType } from '@nestjs/graphql'

import { UserModel } from '../../auth/account/models/user.model'
// import { CategoryModel } from '../../category/models/category.model'
// import { ChatMessageModel } from '../../chat/models/chat-message.model'

@ObjectType({})
export class StreamModel {
  @Field(() => ID)
  id: string

  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  thumbnailUrl: string

  @Field(() => String, { nullable: true })
  ingressId: string

  @Field(() => String, { nullable: true })
  serverUrl: string

  @Field(() => String, { nullable: true })
  streamKey: string

  @Field(() => Boolean)
  isLive: boolean

  @Field(() => String)
  userId: string

  @Field(() => UserModel)
  user: UserModel

  // @Field(() => String)
  // categoryId: string

  // @Field(() => CategoryModel)
  // category: CategoryModel

  @Field(() => Boolean)
  isChatEnable: boolean

  @Field(() => Boolean)
  isChatFollowersOnly: boolean

  @Field(() => Boolean)
  isChatPremiumfollowersOnly: boolean

  // @Field(() => [ChatMessageModel])
  // chatMessages: ChatMessageModel[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
