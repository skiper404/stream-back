import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { type IngressInput } from 'livekit-server-sdk'

import { IngresService } from './ingress.service'
import { Authorization } from 'src/shared/decorators/auth.decorator'

import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import type { User } from 'generated/prisma/client'

@Resolver()
export class IngresResolver {
  public constructor(private readonly ingresService: IngresService) {}

  @Authorization()
  @Mutation(() => Boolean, { name: 'createIngress' })
  public async create(@CurrentUser() user: User, @Args('ingressType') ingressType: IngressInput) {
    return await this.ingresService.create(user, ingressType)
  }
}
