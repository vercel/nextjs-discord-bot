import dotenv from 'dotenv';
import discord, { User } from 'discord.js';
import modules from './modules';

dotenv.config();

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error('No bot token found!');
}

const client = new discord.Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  modules.onStartup(client);
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
      await reaction.fetch();
    } catch (error) {
      console.log('Error while trying to fetch a reaction', error);
    }
  }

  modules.onReactionAdd(client, reaction, user as User);
});

// Wake up 🤖
client.login(process.env.DISCORD_BOT_TOKEN);
