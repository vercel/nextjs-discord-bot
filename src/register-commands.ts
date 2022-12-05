import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';
import { allCommands } from './commands';

dotenv.config();

(async () => {
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error('No bot token found!');
  }

  if (!process.env.DISCORD_CLIENT_ID) {
    throw new Error('DISCORD_CLIENT_ID is not set');
  }

  const isDevRegister = process.env.DEV === 'true';
  const guildId = process.env.DEV_GUILD_ID;

  if (isDevRegister && !guildId) {
    throw new Error(
      'The DEV_GUILD_ID env variable should be set to register commands in dev'
    );
  }

  const commands = allCommands().map((file) => file.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_BOT_TOKEN
  );

  console.log(`Started refreshing ${commands.length} application commands.`);

  const data = (await rest.put(
    isDevRegister
      ? Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          guildId ?? ''
        )
      : Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
    { body: commands }
  )) as unknown[];

  console.log(`Successfully reloaded ${data.length} application commands.`);
})();
