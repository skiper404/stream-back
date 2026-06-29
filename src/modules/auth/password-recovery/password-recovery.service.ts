import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { generateToken } from 'src/shared/utils/generate-token.utils'
import { TokenType } from 'src/generated/prisma/enums'
import { getSessionMetadata } from 'src/shared/utils/session.metadata.utils'
import { MailService } from 'src/modules/libs/mail/mail.service'
import { NewPasswordInput } from './inputs/new-password.input'
import { hash } from 'argon2'

@Injectable()
export class PasswordRecoveryService {
  public constructor(
    private prismaService: PrismaService,
    private mailService: MailService
  ) {}

  async resetPassword(input: ResetPasswordInput, userAgent: string) {
    const { email } = input

    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (!user) {
      throw new NotFoundException('User with this email does`t exist')
    }

    const resetPasswordToken = await generateToken(this.prismaService, user, TokenType.PASSWORD_RESET)
    const metadata = await getSessionMetadata(userAgent)

    await this.mailService.sendPasswordResetToken(user.email, resetPasswordToken.token, metadata)

    return true
  }

  async newPassword(input: NewPasswordInput) {
    const { password, token } = input

    const existingToken = await this.prismaService.token.findFirst({ where: { token, type: TokenType.PASSWORD_RESET } })

    if (!existingToken) {
      throw new NotFoundException('Token not found')
    }

    if (!existingToken.userId) {
      throw new NotFoundException('Token don`t relate to user')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException('Token expired')
    }

    await this.prismaService.user.update({
      where: { id: existingToken.userId },
      data: { password: await hash(password) }
    })

    await this.prismaService.token.delete({ where: { id: existingToken.id, type: TokenType.PASSWORD_RESET } })

    return true
  }
}
