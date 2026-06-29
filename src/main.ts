import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import session, { type SessionOptions } from 'express-session'
import { RedisService } from './core/redis/redis.service'
import { RedisStore } from 'connect-redis'
import { graphqlUploadExpress } from 'graphql-upload-ts'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule)
  const config = app.get(ConfigService)
  const redis = app.get(RedisService)

  // app.getHttpAdapter().getInstance().set('trust proxy', 1)
  app.use(cookieParser(config.getOrThrow('COOKIE_SECRET')))

  app.enableCors({
    origin: ['https://skiper.dev', 'https://www.skiper.dev', 'http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['set-cookie']
  })

  const sessionOptions: SessionOptions = {
    secret: config.getOrThrow('SESSION_SECRET'),
    name: config.getOrThrow('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,

    store: new RedisStore({ client: redis.client, prefix: config.getOrThrow('SESSION_FOLDER') }),

    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      httpOnly: config.getOrThrow('SESSION_HTTP_ONLY') === 'true', // нельзя читать с клиента
      secure: config.getOrThrow('SESSION_SECURE') === 'true', // true - https only
      sameSite: config.getOrThrow('SESSION_SAME_SITE')
    }
  }

  app.use(session(sessionOptions))

  app.use(config.getOrThrow('GRAPHQL_PREFIX'), graphqlUploadExpress())

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const port = Number(process.env.PORT || 4000)

  await app.listen(port, '0.0.0.0')

  console.log('Listening on', port)
}
void bootstrap()
