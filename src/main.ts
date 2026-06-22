import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import session, { type SessionOptions } from 'express-session'
import ms from 'ms'
import { parseBoolean } from './shared/utils/parse-boolean.utils'
import { RedisService } from './core/redis/redis.service'
import { RedisStore } from 'connect-redis'
import { graphqlUploadExpress } from 'graphql-upload-ts'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule)

  const config = app.get(ConfigService)
  const redis = app.get(RedisService)

  app.use(cookieParser(config.getOrThrow('COOKIE_SECRET')))

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie']
  })

  const sessionOptions: SessionOptions = {
    secret: config.getOrThrow('SESSION_SECRET'),
    name: config.getOrThrow('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,

    store: new RedisStore({ client: redis.client, prefix: config.getOrThrow('SESSION_FOLDER') + ':' }),

    cookie: {
      maxAge: Number(ms(config.getOrThrow('SESSION_MAX_AGE'))),
      httpOnly: parseBoolean(config.getOrThrow('SESSION_HTTP_ONLY')),
      secure: parseBoolean(config.getOrThrow('SESSION_SECURE')),
      sameSite: 'lax'
    }
  }

  app.use(session(sessionOptions))

  app.use(config.getOrThrow('GRAPHQL_PREFIX'), graphqlUploadExpress())

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(config.getOrThrow('APPLICATION_PORT'))
}
void bootstrap()
