import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { PasswordRecoveryService } from './password-recovery.service'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { NewPasswordInput } from './inputs/new-password.input'

@Resolver()
export class PasswordRecoveryResolver {
  constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

  @Mutation(() => Boolean, { name: 'resetPassword' })
  resetPassword(@Args('data') input: ResetPasswordInput, @UserAgent() userAgent: string) {
    return this.passwordRecoveryService.resetPassword(input, userAgent)
  }

  @Mutation(() => Boolean, { name: 'newPassword' })
  newPassword(@Args('data') input: NewPasswordInput) {
    return this.passwordRecoveryService.newPassword(input)
  }
}
