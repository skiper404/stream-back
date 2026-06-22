import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { StreamService } from './stream.service'
import { StreamModel } from './models/stream.model'
import { FiltersInput } from './input/filters.input'
import type { User } from 'generated/prisma/browser'
import { Authorization } from 'src/shared/decorators/auth.decorator'
import { ChangeStreamInfoInput } from './input/change-stream-info.input'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { type FileUpload, GraphQLUpload } from 'graphql-upload-ts'
import { FileValidationPipe } from 'src/shared/pipes/file-validation.pipe'

@Resolver()
export class StreamResolver {
  constructor(private readonly streamService: StreamService) {}

  @Query(() => [StreamModel], { name: 'getAllStreams' })
  public async getAll(@Args('filters') input: FiltersInput) {
    return await this.streamService.getAll(input)
  }

  @Query(() => [StreamModel], { name: 'findRandomStreams' })
  public async findRandom() {
    return await this.streamService.findRandom()
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeStreamInfo' })
  public changeInfo(@CurrentUser() user: User, @Args('data') input: ChangeStreamInfoInput) {
    return this.streamService.changeInfo(user, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
  public async changeThumbail(
    @CurrentUser() user: User,
    @Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
    thumbnail: FileUpload
  ) {
    return this.streamService.changeThumbnail(user, thumbnail)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
  public removeThumbnail(@CurrentUser() user: User) {
    return this.streamService.removeThumbnail(user)
  }

  // @Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
  // public async generateToken(@Args('data') input: GenerateStreamTokenInput) {
  //   return this.streamService.generateToken(input)
  // }
}
