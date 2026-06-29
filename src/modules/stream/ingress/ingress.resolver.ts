import { Mutation, Query, Resolver } from '@nestjs/graphql'

import { IngressService } from './ingress.service'
import { Authorization } from 'src/shared/decorators/auth.decorator'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import type { User } from 'src/generated/prisma/client'
import { IngressModel } from './models/ingress.model'
import { RoomModel } from './models/room.model'

@Resolver()
export class IngressResolver {
  public constructor(private readonly ingressService: IngressService) {}

  @Authorization()
  @Query(() => [IngressModel], { name: 'getIngresses' })
  public async getIngresses(@CurrentUser() user: User) {
    return await this.ingressService.getIngresses(user)
  }

  @Authorization()
  @Query(() => [RoomModel], { name: 'getRooms' })
  public async getRooms(@CurrentUser() user: User) {
    return await this.ingressService.getRooms(user)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeIngresses' })
  public async removeIngresses(@CurrentUser() user: User) {
    return await this.ingressService.removeIngresses(user)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'createIngress' })
  public async create(@CurrentUser() user: User) {
    return await this.ingressService.createIngress(user)
  }
}
