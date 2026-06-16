import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class UserService {
  public constructor(private prismaService: PrismaService) {}

  async getUsers() {
    const users = await this.prismaService.user.findMany()

    return users
  }
}
