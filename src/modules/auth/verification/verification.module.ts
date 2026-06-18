import { Global, Module } from '@nestjs/common'
import { VerificationService } from './verification.service'
import { VerificationResolver } from './verification.resolver'

@Global()
@Module({
  providers: [VerificationResolver, VerificationService],
  exports: [VerificationService]
})
export class VerificationModule {}
