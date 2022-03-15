import { Client, Message, MessageReaction, User } from 'discord.js';

/* --------------------
 * Feature handlers
 */

export type OnStartupHandler = (client: Client) => Promise<void>;

export type OnMessageHandler = (
  client: Client,
  message: Message
) => Promise<void>;

export type OnReactionHandler = (
  client: Client,
  reaction: MessageReaction,
  user: User
) => Promise<void>;

/* -------------------------------------------------- */

export type FeatureFile = {
  onStartup?: OnStartupHandler;
  onMessage?: OnMessageHandler;
  onReactionAdd?: OnReactionHandler;
  onReactionRemove?: OnReactionHandler;
};
