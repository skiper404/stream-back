import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '@nestjs-modules/mailer'
import { render } from '@react-email/components'

import { SessionMetadata } from 'src/shared/types/session-metadata.types'
import { VerificationEmail } from './templates/VerificationEmail'
import { ResetPassword } from './templates/ResetPassword'
import { DeactivateTemplate } from './templates/DeactivationAccount'
import { AccountDeletionTemplate } from './templates/DeletionAccount'

@Injectable()
export class MailService {
  public constructor(
    private configService: ConfigService,
    private mailerService: MailerService
  ) {}

  public async sendVerificationToken(email: string, token: string): Promise<any> {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(VerificationEmail({ domain, token }))
    return this.mailerService.sendMail({ to: email, subject: 'Email Verification', html })
  }

  public async sendPasswordResetToken(email: string, token: string, metadata: SessionMetadata): Promise<any> {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
    const html = await render(ResetPassword({ domain, token, metadata }))
    return this.mailerService.sendMail({ to: email, subject: 'Reset Password', html })
  }

  public async sendDeactivationAccountToken(email: string, token: string, metadata: SessionMetadata): Promise<any> {
    const html = await render(DeactivateTemplate({ token, metadata }))
    return this.mailerService.sendMail({ to: email, subject: 'Deactivation Account', html })
  }

  public async sendAccountDeletion(email: string): Promise<any> {
    const html = await render(AccountDeletionTemplate())
    return this.mailerService.sendMail({ to: email, subject: 'Deletion Account', html })
  }
}
