import { User } from 'src/generated/prisma/client'
import { TokenType } from 'src/generated/prisma/enums'
import { PrismaService } from 'src/core/prisma/prisma.service'

export async function generateToken(
  prismaService: PrismaService,
  user: User,
  type: TokenType
  // isUUID: boolean = true
) {
  const token = crypto.randomUUID()

  // if (isUUID) {
  //   token = crypto.randomUUID()
  // } else {
  //   token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString()
  // }

  const expiresIn = new Date(new Date().getTime() + 300000) // 5 min

  const existingToken = await prismaService.token.findFirst({
    where: { type, user: { id: user.id } }
  })

  if (existingToken) {
    await prismaService.token.delete({ where: { id: existingToken.id } })
  }

  const newToken = await prismaService.token.create({
    data: { token, expiresIn, type, user: { connect: { id: user.id } } }
    // include: {
    //   user: { include: { notificationSettings: true } }
    // }
  })

  return newToken
}
