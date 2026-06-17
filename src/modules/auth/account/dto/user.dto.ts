import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserDto {
  @Field(() => ID)
  public id: string

  @Field(() => String)
  public username: string

  @Field(() => String)
  public email: string

  @Field(() => String)
  public password: string
}
