import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/generated/prisma/client'
import { IngressClient, IngressInput, RoomServiceClient } from 'livekit-server-sdk'
import { PrismaService } from 'src/core/prisma/prisma.service'

@Injectable()
export class IngressService {
  private client: IngressClient
  private room: RoomServiceClient

  public constructor(
    private prismaService: PrismaService,
    private configService: ConfigService
  ) {
    this.client = new IngressClient(
      this.configService.getOrThrow<string>('LIVEKIT_URL'),
      this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
      this.configService.getOrThrow<string>('LIVEKIT_API_SECRET')
    )

    this.room = new RoomServiceClient(
      this.configService.getOrThrow<string>('LIVEKIT_URL'),
      this.configService.getOrThrow<string>('LIVEKIT_API_KEY'),
      this.configService.getOrThrow<string>('LIVEKIT_API_SECRET')
    )
  }

  public async getIngresses(user: User) {
    const ingresses = await this.client.listIngress({ roomName: user.id })

    console.log(
      'получил все ингрессы',
      ingresses.map((ingress) => ({
        ingressId: ingress.ingressId ?? '',
        serverUrl: ingress.url ?? '',
        streamKey: ingress.streamKey ?? ''
      }))
    )

    return ingresses.map((ingress) => ({
      ingressId: ingress.ingressId ?? '',
      serverUrl: ingress.url ?? '',
      streamKey: ingress.streamKey ?? ''
    }))
  }

  public async getRooms(user: User) {
    const rooms = await this.room.listRooms([user.id])

    return rooms.map((room) => ({
      name: room.name,
      numParticipants: room.numParticipants,
      creationTime: room.creationTime?.toString()
    }))
  }

  public async createIngress(user: User) {
    await this.removeIngresses(user)

    // вот тут создаю обьект ингресс {ingresId, url, streamKey}
    const ingress = await this.client.createIngress(IngressInput.RTMP_INPUT, {
      name: user.username,
      roomName: user.id,
      participantName: user.username,
      participantIdentity: user.id
    })

    console.log('создал ингресс', {
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey
    })

    if (!ingress || !ingress.url || !ingress.streamKey) {
      throw new BadRequestException('Error creating ingress')
    }

    console.log('обновил поля ingressId, serverUrl, streamKey')

    await this.prismaService.stream.upsert({
      where: { userId: user.id },
      update: {
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey
      },
      create: {
        title: `Stream ${user.username}`,
        userId: user.id,
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey
      }
    })

    return true
  }

  public async removeIngresses(user: User) {
    const ingresses = await this.getIngresses(user)

    for (const ingress of ingresses) {
      await this.client.deleteIngress(ingress.ingressId)
    }

    console.log('удалил все ингрессы')

    return true
  }
}
