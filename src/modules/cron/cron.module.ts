import { Module } from '@nestjs/common'
import { CronService } from './cron.service'
import { MailModule } from '../libs/mail/mail.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [ScheduleModule.forRoot(), MailModule],
  providers: [CronService]
})
export class CronModule {}
