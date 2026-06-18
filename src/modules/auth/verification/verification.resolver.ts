import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { VerificationService } from './verification.service'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import type { GqlContext } from 'src/shared/types/gql-context.type'
import { VerificationInput } from './inputs/verification.input'

@Resolver()
export class VerificationResolver {
  constructor(private verificationService: VerificationService) {}

  @Mutation(() => Boolean, { name: 'verifyAccount' })
  async verifyAccount(
    @Context() context: GqlContext,
    @Args('data') input: VerificationInput,
    @UserAgent() userAgent: string
  ) {
    return this.verificationService.verify(context, input, userAgent)
  }
}
