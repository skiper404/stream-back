import { Module } from '@nestjs/common'

import { IngresResolver } from './ingress.resolver'
import { IngresService } from './ingress.service'

@Module({
  providers: [IngresResolver, IngresService]
})
export class IngresModule {}
