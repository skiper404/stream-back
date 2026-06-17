import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { SessionService } from './session.service'
import { LoginUserInput } from './inputs/login-user.input'
import type { GqlContext } from 'src/shared/types/gql-context.type'

@Resolver()
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => Boolean, { name: 'loginUser' })
  public async loginUser(@Args('data') input: LoginUserInput, @Context() context: GqlContext) {
    return this.sessionService.login(input, context)
  }

  @Mutation(() => Boolean, { name: 'logoutUser' })
  public async logoutUser(@Context() context: GqlContext) {
    return this.sessionService.logout(context)
  }
}
