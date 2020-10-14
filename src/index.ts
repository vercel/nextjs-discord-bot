import dotenv from 'dotenv';
import discord from 'discord.js';
import modules from './modules';

dotenv.config();

const client = new discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  modules.startup(client);
});

// Wake up 🤖
client.login(process.env.DISCORD_BOT_TOKEN);
