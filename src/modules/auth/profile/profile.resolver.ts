import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ProfileService } from './profile.service'
import type { User } from 'generated/prisma/browser'
import { Authorization } from 'src/shared/decorators/auth.decorator'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { FileValidationPipe } from 'src/shared/pipes/file-validation.pipe'
import { GraphQLUpload, type FileUpload } from 'graphql-upload-ts'
import { BioInput } from './inputs/bio.input'
import { SocialLinkModel } from './models/social-link.model'
import { SocialLinkInput } from './inputs/social-link.input'

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeProfileAvatar' })
  public async changeAvatar(
    @CurrentUser() user: User,
    @Args('avatar', { type: () => GraphQLUpload }, FileValidationPipe)
    avatar: FileUpload
  ) {
    return this.profileService.changeAvatar(user, avatar)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeProfileAvatar' })
  public async removeAvatar(@CurrentUser() user: User) {
    return this.profileService.removeAvatar(user)
  }

  // @Authorization()
  @Mutation(() => Boolean, { name: 'changeProfileBio' })
  public async changeBio(@CurrentUser() user: User, @Args('data') input: BioInput) {
    return this.profileService.changeBio(user, input)
  }

  @Authorization()
  @Query(() => [SocialLinkModel], { name: 'getSocialLinks' })
  public async getSocialLinks(@CurrentUser() user: User) {
    return this.profileService.getSocialLinks(user)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'createSocialLink' })
  public async createSocialLink(@CurrentUser() user: User, @Args('data') input: SocialLinkInput) {
    return this.profileService.createSocialLink(user, input)
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'removeSocialLink' })
  public async removeSocialLink(@CurrentUser() user: User, @Args('id') id: string) {
    return this.profileService.removeSocialLink(user, id)
  }
}
