import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { TotpService } from './totp.service'
import { Authorization } from 'src/shared/decorators/auth.decorator'

import { TotpModel } from './models/totp.model'
import { EnableTotpInput } from './input/enable-totp.input'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import type { User } from 'generated/prisma/client'

@Resolver()
export class TotpResolver {
  constructor(private readonly totpService: TotpService) {}

  @Authorization()
  @Query(() => TotpModel, { name: 'generateTotpSecret' })
  async generateTotpSecret(@CurrentUser() user: User) {
    return this.totpService.generateTotpSecret(user)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'enableTotp' })
  async enableTotp(@CurrentUser() user: User, @Args('data') input: EnableTotpInput) {
    return this.totpService.enableTotp(user, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'disableTotp' })
  async disabledTotp(@CurrentUser() user: User) {
    return this.totpService.disableTotp(user)
  }
}
