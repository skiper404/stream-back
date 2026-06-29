import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { LoginUserInput } from './inputs/login-user.input'
import { verify } from 'argon2'
import { GqlContext } from 'src/shared/types/gql-context.type'
import { destroySession, saveSession } from 'src/shared/utils/sessions.utils'
import { ConfigService } from '@nestjs/config'
import { RedisService } from 'src/core/redis/redis.service'
import { getSessionMetadata } from 'src/shared/utils/session.metadata.utils'
import { VerificationService } from '../verification/verification.service'

interface Session {
  userId: string
  createdAt: number
  [key: string]: any
}

interface SessionData {
  id: string
  createdAt: number
}

@Injectable()
export class SessionService {
  public constructor(
    private prismaService: PrismaService,
    private redisService: RedisService,
    private configService: ConfigService,
    private verificationService: VerificationService
  ) {}

  async login(input: LoginUserInput, context: GqlContext, userAgent: string) {
    const { login, password } = input

    const existingUser = await this.prismaService.user.findFirst({
      where: { OR: [{ email: login }, { username: login }] }
    })

    if (!existingUser) {
      throw new UnauthorizedException('Wrong login or password')
    }

    const isPasswordValid = await verify(existingUser.password, password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong login or password')
    }

    if (!existingUser.isEmailVerified) {
      await this.verificationService.sendVerificationToken(existingUser)

      throw new BadRequestException('Account not verified. Check your email')
    }

    const metadata = await getSessionMetadata(userAgent)

    return saveSession(context, existingUser, metadata)
  }

  async logout(context: GqlContext) {
    return destroySession(context, this.configService)
  }

  public async getCurrentSession(context: GqlContext) {
    const sessionId = context.req.sessionID
    const key = `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`

    const sessionData = await this.redisService.client.get(key)

    if (!sessionData) {
      throw new NotFoundException('Session not found')
    }

    const rawSession: SessionData = JSON.parse(sessionData)

    const session = { ...rawSession, id: sessionId }

    return session
  }

  public async getUserSessions(context: GqlContext) {
    const { req } = context
    const userId = req.session.userId

    if (!userId) {
      throw new NotFoundException('User not found in session')
    }

    const keys = await this.redisService.client.keys('*')
    if (!keys) return []

    const userSessions: Array<Session & { id: string }> = []

    for (const key of keys) {
      const sessionData = await this.redisService.client.get(key)

      if (sessionData) {
        const session: Session = JSON.parse(sessionData)

        if (session.userId === userId) {
          userSessions.push({ ...session, id: key.split(':')[1] })
        }
      }
    }

    userSessions.sort((a, b) => a.createdAt - b.createdAt)

    return userSessions.filter((session) => session.id !== req.session.id)
  }

  public clearSession(context: GqlContext) {
    context.res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
    return true
  }

  public async removeSession(context: GqlContext, id: string) {
    if (context.req.session.id === id) {
      throw new ConflictException('Cannot remove current session')
    }

    await this.redisService.client.del(`${this.configService.getOrThrow<string>('SESSION_FOLDER')}:${id}`)

    return true
  }
}
