import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { GqlContext } from 'src/shared/types/gql-context.type'
import { isDev } from 'src/shared/utils/is-dev.utils'

export function getGraphQLConfig(configService: ConfigService): ApolloDriverConfig {
  return {
    playground: isDev(configService),
    path: configService.getOrThrow('GRAPHQL_PREFIX'),
    autoSchemaFile: join(process.cwd(), '/src/generated/graphql/schema.gql'),
    sortSchema: true,
    context: ({ req, res }: GqlContext) => ({ req, res }),
    csrfPrevention: false // for file uploads
  }
}
