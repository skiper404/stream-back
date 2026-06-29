import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IngressModel {
  @Field(() => String, { nullable: true })
  ingressId?: string

  @Field(() => String, { nullable: true })
  serverUrl?: string

  @Field(() => String, { nullable: true })
  streamKey?: string
}
