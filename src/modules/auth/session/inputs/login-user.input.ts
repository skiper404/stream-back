import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class LoginUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  public login: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string
}
