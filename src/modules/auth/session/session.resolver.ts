import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { SessionService } from './session.service'
import { LoginUserInput } from './inputs/login-user.input'
import type { GqlContext } from 'src/shared/types/gql-context.type'
import { Authorization } from 'src/shared/decorators/auth.decorator'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { SessionModel } from './models/session.model'

@Resolver()
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Mutation(() => Boolean, { name: 'loginUser' })
  public async loginUser(
    @Args('data') input: LoginUserInput,
    @Context() context: GqlContext,
    @UserAgent() userAgent: string
  ) {
    return this.sessionService.login(input, context, userAgent)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'logoutUser' })
  public async logoutUser(@Context() context: GqlContext) {
    return this.sessionService.logout(context)
  }

  @Authorization()
  @Query(() => SessionModel, { name: 'getCurrentSession' })
  public getCurrentSession(@Context() context: GqlContext) {
    return this.sessionService.getCurrentSession(context)
  }

  @Authorization()
  @Query(() => [SessionModel], { name: 'getUserSessions' })
  public getUserSessions(@Context() context: GqlContext): Promise<any> {
    return this.sessionService.getUserSessions(context)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'clearSessionCookie' })
  public clearSession(@Context() context: GqlContext) {
    return this.sessionService.clearSession(context)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSession' })
  public async remove(@Context() context: GqlContext, @Args('id') id: string) {
    return this.sessionService.removeSession(context, id)
  }
}
