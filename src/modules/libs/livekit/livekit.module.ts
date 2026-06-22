import { type DynamicModule, Module } from '@nestjs/common'

import { LivekitService } from './livekit.service'
import { LivekitOptionsSymbol, TypeLiveKitAsyncOptions } from './types/livekit.types'

@Module({})
export class LivekitModule {
  public static register(options: TypeLiveKitAsyncOptions): DynamicModule {
    return {
      module: LivekitModule,
      providers: [{ provide: LivekitOptionsSymbol, useValue: options }, LivekitService],
      exports: [LivekitService],
      global: true
    }
  }

  public static registerAsync(options: TypeLiveKitAsyncOptions): DynamicModule {
    return {
      module: LivekitModule,
      imports: options.imports || [],
      providers: [
        {
          provide: LivekitOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        LivekitService
      ],
      exports: [LivekitService],
      global: true
    }
  }
}
