import { Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { UserModel } from './models/user.model'

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  async users() {
    return this.userService.getUsers()
  }
}
