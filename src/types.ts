import { Client, MessageReaction, User } from 'discord.js';

export type OnStartupHandler = (client: Client) => Promise<void>;
export type OnReactionAddHandler = (
  client: Client,
  reaction: MessageReaction,
  user: User
) => Promise<void>;

export type ModuleFile = {
  onStartup?: OnStartupHandler;
  onReactionAdd?: OnReactionAddHandler;
};
