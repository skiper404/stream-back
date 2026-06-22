import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class SocialLinkInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  public title: string

  @Field()
  @IsString()
  @IsNotEmpty()
  public url: string
}
