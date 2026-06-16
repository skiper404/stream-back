import { ObjectType, Field, ID } from '@nestjs/graphql'
import { User } from 'generated/prisma/client'

@ObjectType({})
export class UserModel implements User {
  @Field(() => ID)
  public id: string

  @Field(() => String)
  public email: string
}
