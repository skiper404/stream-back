import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'
import { UserDto } from './dto/user.dto'

@Resolver()
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => [UserDto], { name: 'getUsers' })
  public async getUsers() {
    return this.accountService.get()
  }

  @Mutation(() => Boolean, { name: 'createUser' })
  public async createUser(@Args('data') input: CreateUserInput) {
    return this.accountService.create(input)
  }
}
