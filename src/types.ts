import { Client, MessageReaction, User } from 'discord.js';

export type Handlers = {
  onStartup?: (client: Client) => Promise<void>;
  onReactionAdd?: (
    client: Client,
    reaction: MessageReaction,
    user: User
  ) => Promise<void>;
};
