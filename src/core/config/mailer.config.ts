import { type MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
      host: configService.getOrThrow<string>('MAIL_HOST'),
      port: configService.getOrThrow<string>('MAIL_PORT'),
      secure: false, // 465 - true (Resend) 587 - false (Brevo)
      auth: {
        user: configService.getOrThrow<string>('MAIL_LOGIN'),
        pass: configService.getOrThrow<string>('MAIL_PASSWORD')
      }
    },
    defaults: {
      from: `Skiper-stream <no-reply@skiper.store>`
    }
  }
}
