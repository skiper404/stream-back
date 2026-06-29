import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'

import { ChatService } from './chat.service'
import { ChatMessageModel } from './models/chat-message.model'
import { CurrentUser } from 'src/shared/decorators/current-user.decorator'
import { Authorization } from 'src/shared/decorators/auth.decorator'
import type { User } from 'generated/prisma/client'
import { ChangeChatSettingsInput } from './inputs/change-chat-settings.input'
import { SendMessageInput } from './inputs/send-message.input'

@Resolver()
export class ChatResolver {
  private readonly pubSub: PubSub
  constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub()
  }

  @Query(() => [ChatMessageModel], { name: 'getAllMessages' })
  public async getAllMessages() {
    return this.chatService.getAllMessages()
  }

  @Query(() => [ChatMessageModel], { name: 'findChatMessagesByStream' })
  public async findChatMessagesByStream(@Args('streamId') streamId: string) {
    return this.chatService.findChatMessagesByStream(streamId)
  }

  @Authorization()
  @Mutation(() => ChatMessageModel, { name: 'sendChatMessage' })
  public async sendMessage(@CurrentUser('id') userId: string, @Args('data') input: SendMessageInput) {
    const message = await this.chatService.sendMessage(userId, input)

    await this.pubSub.publish('CHAT_MESSAGE_ADDED', {
      chatMessageAdded: message
    })

    return message
  }

  @Subscription(() => ChatMessageModel, {
    name: 'chatMessageAdded',
    filter: (payload, variables) => payload.chatMessageAdded.streamId === variables.streamId
  })
  public chatMessageAdded() {
    return this.pubSub.asyncIterableIterator('CHAT_MESSAGE_ADDED')
  }

  @Authorization()
  @Mutation(() => Boolean, { name: 'changeChatSettings' })
  public async changeSettings(@CurrentUser() user: User, @Args('data') input: ChangeChatSettingsInput) {
    return this.chatService.changeSettings(user, input)
  }
}
