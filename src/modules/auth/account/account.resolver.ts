import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './models/user.model'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import type { User } from 'generated/prisma/client'
import { ChangeEmailInput } from './inputs/change-email.input'
import { ChangePasswordInput } from './inputs/change-password.input'
import { Authorization } from 'src/shared/decorators/auth.decorator'

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(() => UserModel, { name: 'getMe' })
  public async getMe(@CurrentUser() user: User) {
    return this.accountService.me(user)
  }

  @Mutation(() => Boolean, { name: 'createUser' })
  public async createUser(@Args('data') input: CreateUserInput) {
    return this.accountService.create(input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeEmail' })
  public async changeEmail(@Args('data') input: ChangeEmailInput, @CurrentUser() user: User) {
    return this.accountService.changeEmail(user, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changePassword' })
  public async changePassword(@Args('data') input: ChangePasswordInput, @CurrentUser() user: User) {
    return this.accountService.changePassword(user, input)
  }
}
