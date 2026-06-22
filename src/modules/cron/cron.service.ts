import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/core/prisma/prisma.service'
import { MailService } from '../libs/mail/mail.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { StorageService } from '../libs/storage/storage.service'

@Injectable()
export class CronService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly storageService: StorageService
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async deleteDeactivatedAccounts() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 day ago in ms

    const deactivatedAccounts = await this.prismaService.user.findMany({
      where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } }
    })

    for (const user of deactivatedAccounts) {
      await this.mailService.sendAccountDeletion(user.email)

      // if (user.notificationSettings?.telegramNotifications && user.telegramId) {
      //   await this.telegramService.sendAccounDeletion(user.telegramId)
      // }

      if (user.avatar) {
        await this.storageService.remove(user.avatar)
      }

      // if (user.stream?.thumbnailUrl) {
      //   await this.storageService.remove(user.stream.thumbnailUrl)
      // }
    }

    await this.prismaService.user.deleteMany({ where: { isDeactivated: true, deactivatedAt: { lte: sevenDaysAgo } } })
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async verifyChannels() {
    // const users = await this.prismaService.user.findMany({})
    // for (const user of users) {
    //   const followersCount = await this.prismaService.follow.count({
    //     where: { followingId: user.id }
    //   })
    //   if (followersCount < 10 && !user.isVerified) {
    //     await this.prismaService.user.update({
    //       where: { id: user.id },
    //       data: { isVerified: true }
    //     })
    //     await this.mailService.sendVerifyChannel(user.email)
    //     if (user.notificationSettings?.siteNotifications) {
    //       await this.notificationService.createVerifyChannel(user.id)
    //     }
    //     if (user.notificationSettings?.telegramNotifications && user.telegramId) {
    //       await this.telegramService.sendVerifyChannel(user.telegramId)
    //     }
    //   }
    // }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // public async deleteOldNotifications() {
  //   const sevenDayAgo = new Date()
  //   sevenDayAgo.setDate(sevenDayAgo.getDate() - 7)

  //   await this.prismaService.notification.deleteMany({
  //     where: { createdAt: { lte: sevenDayAgo } }
  //   })
  // }
}
