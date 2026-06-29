import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
  // RawBody,
  UnauthorizedException
} from '@nestjs/common'
import { WebhookService } from './webhook.service'

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('livekit')
  @HttpCode(HttpStatus.OK)
  public async recieveWebhooksLivekit(
    @Body() body: string,
    @Headers('authorization')
    authHeader: string
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found')
    }

    return this.webhookService.recieveWebhookLivekit(body, authHeader)
  }

  // @Post('stripe')
  // @HttpCode(HttpStatus.OK)
  // public async recieveWebhookStripe(@RawBody() rawBody: string, @Headers('stripe-signature') sig: string) {
  //   if (!sig) {
  //     throw new UnauthorizedException('Отсутствует заголовок stripe')
  //   }

  //   const event = this.webhookService.constructStripeEvent(rawBody, sig)

  //   await this.webhookService.receiveWebhookStripe(event)
  // }
}
