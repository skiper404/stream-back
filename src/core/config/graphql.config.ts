import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { isDev } from 'src/shared/utils/is-dev.utils'

interface GraphQLContext {
  req: Request
  res: Response
}

export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
  return {
    playground: isDev(configService),
    path: configService.getOrThrow('GRAPHQL_PREFIX'),
    autoSchemaFile: join(process.cwd(), 'generated/graphql/schema.gql'),
    sortSchema: true,
    context: ({ req, res }: GraphQLContext) => ({ req, res })
    // csrfPrevention: false
  }
}
