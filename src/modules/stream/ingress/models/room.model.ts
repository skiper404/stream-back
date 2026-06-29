import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RoomModel {
  @Field()
  name: string
}
