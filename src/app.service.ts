import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  async getHello() {
    const users = await this.prismaService.user.findMany()
    return users
  }
}
