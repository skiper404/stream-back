import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  public constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)

    const req = ctx.getContext().req

    console.log('SESSION RAW:', req.session)
    console.log('SESSION ID COOKIE:', req.sessionID)

    if (typeof req.session.userId === 'undefined') {
      throw new UnauthorizedException('User unauthorized')
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: req.session.userId }
    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    req.user = user

    return true
  }
}
