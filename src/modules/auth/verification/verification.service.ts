import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { getSessionMetadata } from 'src/shared/utils/session.metadata.utils'
import { saveSession } from 'src/shared/utils/sessions.utils'
import { VerificationInput } from './inputs/verification.input'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { TokenType } from 'src/generated/prisma/enums'
import { GqlContext } from 'src/shared/types/gql-context.type'
import { User } from 'src/generated/prisma/browser'
import { generateToken } from 'src/shared/utils/generate-token.utils'
import { MailService } from 'src/modules/libs/mail/mail.service'

@Injectable()
export class VerificationService {
  public constructor(
    private prismaService: PrismaService,
    private mailService: MailService
  ) {}

  async verify(context: GqlContext, input: VerificationInput, userAgent: string) {
    const { token } = input

    const existingToken = await this.prismaService.token.findFirst({
      where: { token, type: TokenType.EMAIL_VERIFY }
    })

    if (!existingToken?.userId) {
      throw new NotFoundException('Token not found or don`t relate to user')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException('Token exceeded')
    }

    const user = await this.prismaService.user.update({
      where: { id: existingToken.userId },
      data: { isEmailVerified: true }
    })

    await this.prismaService.token.delete({
      where: { id: existingToken.id, type: TokenType.EMAIL_VERIFY }
    })

    const metadata = await getSessionMetadata(userAgent)

    return saveSession(context, user, metadata)
  }

  async sendVerificationToken(user: User) {
    const verificationToken = await generateToken(this.prismaService, user, TokenType.EMAIL_VERIFY)

    await this.mailService.sendVerificationToken(user.email, verificationToken.token)

    return true
  }
}
