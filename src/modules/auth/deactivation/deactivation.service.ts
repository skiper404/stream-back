import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { TokenType, User } from 'src/generated/prisma/client'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { MailService } from 'src/modules/libs/mail/mail.service'
import { GqlContext } from 'src/shared/types/gql-context.type'
import { generateToken } from 'src/shared/utils/generate-token.utils'
import { getSessionMetadata } from 'src/shared/utils/session.metadata.utils'
import { DeactivateAccountInput } from './input/deactivate-account.input'
import { verify } from 'argon2'
import { destroySession } from 'src/shared/utils/sessions.utils'
import { ConfigService } from '@nestjs/config'
import { RedisService } from 'src/core/redis/redis.service'

@Injectable()
export class DeactivationService {
  public constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    private configSerivice: ConfigService,
    private redisService: RedisService
  ) {}

  public async deactivateAccount(context: GqlContext, input: DeactivateAccountInput, user: User, userAgent: string) {
    const { email, password, pin } = input

    if (user.email !== email) {
      throw new BadRequestException('Wrong email')
    }

    const isPasswordValid = await verify(user.password, password)

    if (!isPasswordValid) {
      throw new BadRequestException('Wrong password')
    }

    if (!pin) {
      await this.sendDeactivateToken(user, userAgent)
      throw new BadRequestException('Pin code is required')
    }

    await this.validateDeactivationToken(context, pin)

    return true
  }

  public async sendDeactivateToken(user: User, userAgent: string) {
    const deactivateToken = await generateToken(this.prismaService, user, TokenType.DEACTIVATE_ACCOUNT)

    const metadata = await getSessionMetadata(userAgent)

    await this.mailService.sendDeactivationAccountToken(user.email, deactivateToken.token, metadata)

    return true
  }

  public async validateDeactivationToken(context: GqlContext, token: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: { token, type: TokenType.DEACTIVATE_ACCOUNT }
    })

    if (!existingToken) {
      throw new NotFoundException('Token not found')
    }

    if (!existingToken.userId) {
      throw new NotFoundException('Token not relate to user')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException('Token expired')
    }

    await this.prismaService.user.update({
      where: { id: existingToken.userId },
      data: { isDeactivated: true, deactivatedAt: new Date() }
    })

    await this.prismaService.token.delete({ where: { id: existingToken.id } })

    await this.clearSessions(existingToken.userId)

    return destroySession(context, this.configSerivice)
  }

  async clearSessions(userId: string) {
    const keys = await this.redisService.client.keys('*')

    for (const key of keys) {
      const sessionData = await this.redisService.client.get(key)

      if (sessionData) {
        const session = JSON.parse(sessionData)

        if (session.usetId === userId) {
          await this.redisService.client.del(key)
        }
      }
    }
  }
}
