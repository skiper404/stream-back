import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

@InputType()
export class NewPasswordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public passwordRepeat: string

  @Field(() => String)
  @IsUUID('4')
  @IsNotEmpty()
  public token: string
}
