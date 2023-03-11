import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { ContextMenuCommand } from '../../types';

/**
 * No Job Posts command
 * ---
 * Deletes a message and sends a DM to the user telling them to not send job posts
 */

export const command: ContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('No Job Posts')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    const { targetMessage } = interaction;
    const originalMessageContent = targetMessage.content;

    await Promise.all([
      targetMessage.delete(),
      targetMessage.author.send({
        content: `
We currently do not allow job posts in this server, unless it's in the context of a discussion. If you're looking to get hired or to advertise a job vacancy see <#910564441119150100>
Ignoring this warning will result in the account being banned from the server
`,
        embeds: [
          {
            title: 'Deleted message:',
            description: originalMessageContent,
          },
        ],
      }),
      interaction.reply({
        ephemeral: true,
        content: 'Ok!',
      }),
    ]);
  },
};
