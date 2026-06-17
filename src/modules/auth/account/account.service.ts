import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { CreateUserInput } from './inputs/create-user.input'
import { hash } from 'argon2'

@Injectable()
export class AccountService {
  public constructor(private prismaService: PrismaService) {}

  async get() {
    return await this.prismaService.user.findMany()
  }

  async create(input: CreateUserInput) {
    const { username, email, password } = input

    const existingUser = await this.prismaService.user.findFirst({ where: { OR: [{ email }, { username }] } })

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('User with this email already exist')
      }

      if (existingUser.username === username) {
        throw new ConflictException('User with this username already exist')
      }
    }

    await this.prismaService.user.create({ data: { username, email, password: await hash(password) } })

    return true
  }
}
