/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common'
import { User } from 'generated/prisma/client'
import { FileUpload } from 'graphql-upload-ts'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { StorageService } from 'src/modules/libs/storage/storage.service'
import sharp from 'sharp'
import { BioInput } from './inputs/bio.input'
import { SocialLinkInput } from './inputs/social-link.input'

@Injectable()
export class ProfileService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService
  ) {}

  public async changeAvatar(user: User, file: FileUpload) {
    if (user.avatar) {
      await this.storageService.remove(user.avatar)
    }

    const chunks: Buffer[] = []

    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)
    const fileName = `/channels/${user.username}.webp`

    const processBuffer = await sharp(buffer).resize(512, 512).webp().toBuffer()

    await this.storageService.upload(processBuffer, fileName, 'image/webp')
    await this.prismaService.user.update({ where: { id: user.id }, data: { avatar: fileName } })

    return true
  }

  public async removeAvatar(user: User) {
    if (!user.avatar) {
      return
    }

    await this.storageService.remove(user.avatar)

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: null }
    })

    return true
  }

  // public async changeBio(user: User, input: BioInput) {
  //   const { bio } = input
  //   await this.prismaService.user.update({ where: { id: user.id }, data: { bio } })

  //   return true
  // }

  public async changeBio(user: User, input: BioInput) {
    const { bio } = input
    await this.prismaService.user.update({ where: { id: '59f031b5-e284-4187-984d-43b064928738' }, data: { bio } })

    return true
  }

  public async getSocialLinks(user: User) {
    const socialLinks = await this.prismaService.socialLink.findMany({
      where: { userId: user.id }
    })

    return socialLinks
  }

  public async createSocialLink(user: User, input: SocialLinkInput) {
    const { title, url } = input

    await this.prismaService.socialLink.create({ data: { title, url, userId: user.id } })

    return true
  }

  public async removeSocialLink(user: User, id: string) {
    await this.prismaService.socialLink.delete({ where: { id, userId: user.id } })

    return true
  }
}
