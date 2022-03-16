import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import discord, { Intents, User } from 'discord.js';
import { FeatureFile } from './types';

dotenv.config();

const INTRO_CHANNEL_ID = '766393115044216854';
const VERIFIED_ROLE = '930202099264938084';

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error('No bot token found!');
}

const client = new discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const features: FeatureFile[] = [];
const featureFiles = fs
  .readdirSync(path.resolve(__dirname, './features'))
  // Look for files as TS (dev) or JS (built files)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

for (const featureFile of featureFiles) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const feature = require(`./features/${featureFile}`) as FeatureFile;
  features.push(feature);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  features.forEach((f) => f.onStartup?.(client));
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  // if user types into the intros channel, give them the verified role
  if (message.channel.id == INTRO_CHANNEL_ID) {
    message.member?.roles
      .add(VERIFIED_ROLE)
      .catch((err) => console.log(err.message, 'Verify'));
  }

  features.forEach((f) => f.onMessage?.(client, message));
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.partial) {
    try {
      await user.fetch();
    } catch (error) {
      console.log('Error while trying to fetch an user', error);
    }
  }

  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.log('Error while trying to fetch a reaction message', error);
    }
  }

  if (reaction.partial) {
    try {
      const fetchedReaction = await reaction.fetch();
      features.forEach((f) =>
        f.onReactionAdd?.(client, fetchedReaction, user as User)
      );
    } catch (error) {
      console.log('Error while trying to fetch a reaction', error);
    }
  } else {
    features.forEach((f) => f.onReactionAdd?.(client, reaction, user as User));
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (user.partial) {
    try {
      await user.fetch();
    } catch (error) {
      console.log('Error while trying to fetch an user', error);
    }
  }

  if (reaction.message.partial) {
    try {
      await reaction.message.fetch();
    } catch (error) {
      console.log('Error while trying to fetch a reaction message', error);
    }
  }

  if (reaction.partial) {
    try {
      const fetchedReaction = await reaction.fetch();
      features.forEach((f) =>
        f.onReactionRemove?.(client, fetchedReaction, user as User)
      );
    } catch (error) {
      console.log('Error while trying to fetch a reaction', error);
    }
  } else {
    features.forEach((f) =>
      f.onReactionRemove?.(client, reaction, user as User)
    );
  }
});

// Wake up 🤖
client.login(process.env.DISCORD_BOT_TOKEN);
