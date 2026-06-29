import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from 'src/generated/prisma/client'

export const CurrentUser = createParamDecorator((field: keyof User | undefined, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx)
  const user = gqlCtx.getContext().req.user as User

  return field ? user[field] : user
})
