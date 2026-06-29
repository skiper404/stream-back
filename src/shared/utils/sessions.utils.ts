import { User } from 'generated/prisma/client'
import { GqlContext } from '../types/gql-context.type'
import { InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export async function saveSession(context: GqlContext, user: User, metadata: any) {
  const { req } = context

  return new Promise((resolve, reject) => {
    req.session.createdAt = new Date()
    req.session.userId = user.id
    req.session.metadata = metadata

    req.session.save((error) => {
      if (error) {
        return reject(new InternalServerErrorException('Cannot save session'))
      }

      resolve(true)

      console.log('сессия сохранилась')
      console.log(req.secure)
      console.log(req.protocol)
      console.log(req.headers['x-forwarded-proto'])
    })
  })
}

export async function destroySession(context: GqlContext, configService: ConfigService) {
  const { req, res } = context

  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        return reject(new InternalServerErrorException('Cannot destroy session'))
      }

      res.clearCookie(configService.getOrThrow('SESSION_NAME'))
      resolve(true)
    })
  })
}
