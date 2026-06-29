import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { DeactivationService } from './deactivation.service'
import { Authorization } from 'src/shared/decorators/auth.decorator'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import type { GqlContext } from 'src/shared/types/gql-context.type'
import { DeactivateAccountInput } from './input/deactivate-account.input'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { UserModel } from '../account/models/user.model'
import type { User } from 'src/generated/prisma/client'

@Resolver()
export class DeactivationResolver {
  constructor(private readonly deactivationService: DeactivationService) {}

  @Authorization()
  @Mutation(() => UserModel, { name: 'deactivateAccount' })
  async deactivate(
    @Context() context: GqlContext,
    @Args('data') input: DeactivateAccountInput,
    @CurrentUser() user: User,
    @UserAgent() userAgent: string
  ) {
    return this.deactivationService.deactivateAccount(context, input, user, userAgent)
  }
}
