import { BadRequestException, Injectable } from '@nestjs/common'
import { generateSecret, generateURI, verify } from 'otplib'
import { PrismaService } from 'src/core/prisma/prisma.service'
import QRCode from 'qrcode'
import { EnableTotpInput } from './input/enable-totp.input'
import { User } from 'generated/prisma/client'

@Injectable()
export class TotpService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async generateTotpSecret(user: User) {
    const secret = generateSecret()

    const otpauthURL = generateURI({ issuer: 'SkiperSteam', label: user.email, secret })

    const qrcodeUrl = await QRCode.toDataURL(otpauthURL as string)

    return { qrcodeUrl, secret }
  }

  public async enableTotp(user: User, input: EnableTotpInput) {
    const { secret, pin } = input

    const result = await verify({ secret, token: pin })

    if (!result.valid) {
      throw new BadRequestException('Wrong code')
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { isTotpEnabled: true, totpSecret: secret }
    })

    return true
  }

  public async disableTotp(user: User) {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { isTotpEnabled: false, totpSecret: null }
    })

    return true
  }
}
