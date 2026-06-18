import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { CreateUserInput } from './inputs/create-user.input'
import { hash, verify } from 'argon2'
import { VerificationService } from '../verification/verification.service'
import { User } from 'generated/prisma/client'
import { ChangeEmailInput } from './inputs/change-email.input'
import { ChangePasswordInput } from './inputs/change-password.input'

@Injectable()
export class AccountService {
  public constructor(
    private prismaService: PrismaService,
    private verificationService: VerificationService
  ) {}

  async me(user: User) {
    return await this.prismaService.user.findUnique({ where: { id: user.id } })
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

    const newUser = await this.prismaService.user.create({ data: { username, email, password: await hash(password) } })

    await this.verificationService.sendVerificationToken(newUser)

    return true
  }

  async changeEmail(user: User, input: ChangeEmailInput) {
    const { email } = input

    await this.prismaService.user.update({ where: { id: user.id }, data: { email } })

    return true
  }

  async changePassword(user: User, input: ChangePasswordInput) {
    const { newPassword, oldPassword } = input

    const isPasswordValid = await verify(user.password, oldPassword)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password')
    }

    await this.prismaService.user.update({ where: { id: user.id }, data: { password: await hash(newPassword) } })

    return true
  }
}
