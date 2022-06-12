import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import messages from '../messages/message';

if (Object.keys(messages).length > 25)
  throw new Error('Too many messages!, Max is 25');

export const command = new SlashCommandBuilder()
  .setName('docs')
  .setDescription('Shows the documentation')
  .addStringOption((query) => {
    query
      .setName('query')
      .setRequired(true)
      .setDescription('The query to search for')
      .setRequired(true);
    Object.keys(messages).map((message) => {
      query.addChoices({
        name: message.replace(' ', '-').toLocaleUpperCase(),
        value: message,
      });
    });
    return query;
  });
export const execute = async (interaction: CommandInteraction) => {
  const query = interaction.options.getString('query') as keyof typeof messages;
  const message = messages[query];
  if (!message) {
    await interaction.reply({ content: 'Invalid Query Specified.' });
  }
  await interaction.reply({ content: message });
};
