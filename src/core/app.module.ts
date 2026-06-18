import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

import { IS_DEV_ENV } from 'src/shared/utils/is-dev.utils'
import { getGraphQLConfig } from './config/graphql.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { AccountModule } from 'src/modules/auth/account/account.module'
import { SessionModule } from 'src/modules/auth/session/session.module'
import { MailModule } from 'src/modules/libs/mail/mail.module'
import { VerificationModule } from 'src/modules/auth/verification/verification.module'
import { PasswordRecoveryModule } from 'src/modules/auth/password-recovery/password-recovery.module'
import { TotpModule } from 'src/modules/auth/totp/totp.module'
import { DeactivationModule } from 'src/modules/auth/deactivation/deactivation.module'
import { CronModule } from 'src/modules/cron/cron.module'

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: !IS_DEV_ENV, isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getGraphQLConfig
    }),
    PrismaModule,
    RedisModule,
    AccountModule,
    SessionModule,
    MailModule,
    VerificationModule,
    PasswordRecoveryModule,
    TotpModule,
    DeactivationModule,
    CronModule
  ]
})
export class AppModule {}
