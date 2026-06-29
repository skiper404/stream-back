import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, type Request, type Response } from 'express'
import getRawBody from 'raw-body'

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    if (!req.readable) {
      return next(new BadRequestException('Invalid data query'))
    }
    getRawBody(req, { encoding: 'utf-8' })
      .then((rawBody) => {
        req.body = rawBody
        next()
      })
      .catch((error: any) => {
        throw new BadRequestException('Error:', error)
      })
  }
}
