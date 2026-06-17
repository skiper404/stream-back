import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { LoginUserInput } from './inputs/login-user.input'
import { verify } from 'argon2'
import { Request } from 'express'
import { GqlContext } from 'src/shared/types/gql-context.type'
import { destroySession, saveSession } from 'src/shared/utils/sessions.utils'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SessionService {
  public constructor(
    private prismaService: PrismaService,
    private configService: ConfigService
  ) {}

  async login(input: LoginUserInput, context: GqlContext) {
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

    return saveSession(context, existingUser)
  }

  async logout(context: GqlContext) {
    return destroySession(context, this.configService)
  }
}
