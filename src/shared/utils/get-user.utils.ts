import { PrismaService } from 'src/core/prisma/prisma.service'
import { GqlContext } from '../types/gql-context.type'
import { NotFoundException } from '@nestjs/common'

export async function getUser(context: GqlContext, prismaService: PrismaService) {
  const user = await prismaService.user.findUnique({ where: { id: context.req.session.userId } })

  if (!user) {
    throw new NotFoundException('User not found')
  }

  return user
}
