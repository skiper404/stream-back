import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
// import Stripe from 'stripe'

// import { StripeService } from '../libs/stripe/stripe.service'
// import { TelegramService } from '../libs/telegram/telegram.service'
// import { NotificationService } from '../notification/notification.service'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { WebhookReceiver } from 'livekit-server-sdk'

// import { TransactionStatus } from '@/prisma/generated/enums'

@Injectable()
export class WebhookService {
  public livekitReceiver: WebhookReceiver

  public constructor(
    // private readonly notificationService: NotificationService,
    // private readonly telegramService: TelegramService,
    // private readonly stripeService: StripeService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.livekitReceiver = new WebhookReceiver(
      this.configService.getOrThrow('LIVEKIT_API_KEY'),
      this.configService.getOrThrow('LIVEKIT_API_SECRET')
    )
  }

  public async recieveWebhookLivekit(body: string, authHeader: string) {
    const event = await this.livekitReceiver.receive(body, authHeader)

    if (event.event === 'ingress_started') {
      console.log('STREAM STARTED')
      const ingressId = event.ingressInfo?.ingressId

      if (!ingressId) return

      await this.prismaService.stream.update({
        where: { ingressId },
        data: { isLive: true },
        include: { user: true }
      })
    }

    if (event.event === 'ingress_ended') {
      console.log('STREAM ENDED')
      const ingressId = event.ingressInfo?.ingressId

      if (!ingressId) return

      await this.prismaService.stream.update({
        where: { ingressId },
        data: { isLive: false },
        include: { user: true }
      })
    }

    // const followers = await this.prismaService.follow.findMany({
    //   where: {
    //     followingId: stream.user?.id,
    //     follower: { isDeactivated: false }
    //   },
    //   include: { follower: { include: { notificationSettings: true } } }
    // })

    // for (const follow of followers) {
    //   const follower = follow.follower

    //   if (follower.notificationSettings?.siteNotifications) {
    //     await this.notificationService.createStreamStart(follower.id, stream.user)
    //   }

    //   if (follower.notificationSettings?.telegramNotifications && follower.telegramId) {
    //     await this.telegramService.sendStreamStart(follower.telegramId, stream.user)
    //   }
    // }
  }
}

// public async receiveWebhookStripe(event: Stripe.Event) {
//   const session = event.data.object as Stripe.Checkout.Session

//   if (event.type === 'checkout.session.completed') {
//     const planId = session.metadata?.planId
//     const userId = session.metadata?.userId
//     const channelId = session.metadata?.channelId

//     const expiresAt = new Date()
//     expiresAt.setDate(expiresAt.getDate() + 30)

//     const sponsorshipSubscription = await this.prismaService.sponsorshipSubscription.create({
//       data: { expiresAt, planId, userId, channelId },
//       include: {
//         plan: true,
//         user: true,
//         channel: { include: { notificationSettings: true } }
//       }
//     })

//     await this.prismaService.transaction.updateMany({
//       where: {
//         stripeSubscriptionId: session.id,
//         status: TransactionStatus.PENDING
//       },
//       data: { status: TransactionStatus.SUCCESS }
//     })

//     if (sponsorshipSubscription.channel?.notificationSettings?.siteNotifications) {
//       await this.notificationService.createNewSponsorship(
//         sponsorshipSubscription.channel.id,
//         sponsorshipSubscription.plan!,
//         sponsorshipSubscription.user!
//       )
//     }

//     if (
//       sponsorshipSubscription.channel?.notificationSettings?.telegramNotifications &&
//       sponsorshipSubscription.channel.telegramId
//     ) {
//       await this.telegramService.sendNewSponsorship(
//         sponsorshipSubscription.channel.telegramId,
//         sponsorshipSubscription.plan!,
//         sponsorshipSubscription.user!
//       )
//     }
//   }

//   if (event.type === 'checkout.session.expired') {
//     await this.prismaService.transaction.updateMany({
//       where: {
//         stripeSubscriptionId: session.id
//       },
//       data: { status: TransactionStatus.EXPIRED }
//     })
//   }

//   if (event.type === 'checkout.session.async_payment_failed') {
//     await this.prismaService.transaction.updateMany({
//       where: {
//         stripeSubscriptionId: session.id
//       },
//       data: { status: TransactionStatus.FAILED }
//     })
//   }
// }

// public constructStripeEvent(payload: string, signature: string) {
//   return this.stripeService.webhooks.constructEvent(
//     payload,
//     signature,
//     this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET')
//   )
// }
