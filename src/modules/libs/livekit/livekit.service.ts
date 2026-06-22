/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from '@nestjs/common'
import { IngressClient, RoomServiceClient, WebhookReceiver } from 'livekit-server-sdk'
import { LivekitOptionsSymbol, type TypeLiveKitOptions } from './types/livekit.types'

@Injectable()
export class LivekitService {
  private roomService: RoomServiceClient
  private ingressClient: IngressClient
  private webhookReciver: WebhookReceiver

  public constructor(@Inject(LivekitOptionsSymbol) private readonly options: TypeLiveKitOptions) {
    this.roomService = new RoomServiceClient(this.options.apiUrl, this.options.apiKey, this.options.apiSecret)
    this.ingressClient = new IngressClient(this.options.apiUrl)
    this.webhookReciver = new WebhookReceiver(this.options.apiKey, this.options.apiSecret)
  }

  private createProxy<T extends object>(target: T) {
    return new Proxy(target, {
      get: (obj, prop) => {
        const value = obj[prop as keyof T]

        if (typeof value === 'function') {
          return value.bind(obj)
        }
        return value
      }
    })
  }

  public get ingress(): IngressClient {
    return this.createProxy(this.ingressClient)
  }

  public get room(): RoomServiceClient {
    return this.createProxy(this.roomService)
  }

  public get reciver(): WebhookReceiver {
    return this.createProxy(this.webhookReciver)
  }
}
