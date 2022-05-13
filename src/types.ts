import {
  Client,
  Message,
  MessageReaction,
  User,
  CommandInteraction,
} from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
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

export type CommandFile = {
  command: SlashCommandBuilder;
  execute: (message: CommandInteraction) => Promise<void>;
};
