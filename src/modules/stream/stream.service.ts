import { Injectable, NotFoundException } from '@nestjs/common'
import sharp from 'sharp'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { FiltersInput } from './input/filters.input'
import { Prisma, User } from 'src/generated/prisma/client'
import { ChangeStreamInfoInput } from './input/change-stream-info.input'
import { FileUpload } from 'graphql-upload-ts'
import { StorageService } from '../libs/storage/storage.service'
import { AccessToken } from 'livekit-server-sdk'
import { GenerateStreamTokenInput } from './input/generate-stream-token.input'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StreamService {
  public constructor(
    private prismaService: PrismaService,
    private storageService: StorageService,
    private configService: ConfigService
  ) {}

  public async getAll(input: FiltersInput = {}) {
    const { take, skip, searchTerm } = input // 12, 0, Car

    const whereClause = searchTerm ? this.findBySearchTermFilter(searchTerm) : undefined

    const streams = await this.prismaService.stream.findMany({
      take: take ?? 12,
      skip: skip ?? 0,
      where: { user: { isDeactivated: false }, ...whereClause },
      include: {
        user: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return streams
  }

  public async findRandom() {
    const total = await this.prismaService.stream.count({
      where: { user: { isDeactivated: false } }
    })

    const randomIndexes = new Set<number>()

    while (randomIndexes.size < 4) {
      const randomIndex = Math.floor(Math.random() * total)
      randomIndexes.add(randomIndex)
    }
    const streams = await this.prismaService.stream.findMany({
      where: { user: { isDeactivated: false } },
      include: {
        user: true,
        category: true
      },
      skip: 0,
      take: total
    })

    return Array.from(randomIndexes).map((index) => streams[index])
  }

  public async changeInfo(user: User, input: ChangeStreamInfoInput) {
    const { title, categoryId } = input
    await this.prismaService.stream.update({
      where: { userId: user.id },
      data: {
        title,
        category: { connect: { id: categoryId } }
      }
    })

    return true
  }

  public async changeThumbnail(user: User, file: FileUpload) {
    const stream = await this.findByUserId(user)

    if (stream?.thumbnailUrl) {
      await this.storageService.remove(stream.thumbnailUrl)
    }

    const chunks: Buffer[] = []

    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)
    const fileName = `/streams/${user.username}.webp`

    const processedBuffer = await sharp(buffer, { animated: true }).resize(1280, 720).webp().toBuffer()

    await this.storageService.upload(processedBuffer, fileName, 'image/webp')

    await this.prismaService.stream.update({
      where: { userId: user.id },
      data: { thumbnailUrl: fileName }
    })

    return true
  }

  public async removeThumbnail(user: User) {
    const stream = await this.findByUserId(user)

    if (stream?.thumbnailUrl) {
      await this.storageService.remove(stream.thumbnailUrl)
    }

    await this.prismaService.stream.update({
      where: { id: user.id },
      data: { thumbnailUrl: null }
    })

    return true
  }

  private async findByUserId(user: User) {
    const stream = await this.prismaService.stream.findUnique({
      where: { userId: user.id }
    })

    return stream
  }

  public async generateToken(input: GenerateStreamTokenInput) {
    const { userId, channelId } = input

    let self: { id: string; username: string }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId }
    })

    if (user) {
      self = { id: user.id, username: user.username }
    } else {
      self = {
        id: userId,
        username: `User ${Math.floor(Math.random() * 100000)}`
      }
    }

    const channel = await this.prismaService.user.findUnique({
      where: { id: channelId }
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    const isHost = self.id === channel.id

    const token = new AccessToken(
      this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
      this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
      {
        identity: isHost ? `Host-${self.id}` : self.id.toString(),
        name: self.username
      }
    )

    token.addGrant({
      room: channel.id,
      roomJoin: true,
      canPublish: isHost
    })

    return { token: token.toJwt() }
  }

  private findBySearchTermFilter(searchTerm: string): Prisma.StreamWhereInput {
    return {
      OR: [
        {
          title: { contains: searchTerm, mode: 'insensitive' }
        },
        { user: { username: { contains: searchTerm, mode: 'insensitive' } } }
        // { category: { title: { contains: searchTerm, mode: 'insensitive' } } }
      ]
    }
  }
}
