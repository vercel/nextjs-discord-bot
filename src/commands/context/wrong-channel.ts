import {
  ActionRowBuilder,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { ContextMenuCommand } from '../../types';

/**
 * Wrong channel command
 * ---
 * Deletes a message and sends a DM to the user telling them it's in the wrong channel
 */

export const command: ContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Wrong Channel')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    const { targetMessage } = interaction;
    const originalMessageContent = targetMessage.content;

    const modal = new ModalBuilder()
      .setCustomId('wrongChannel')
      .setTitle('Delete wrong channel message')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('modMessageInput')
            .setLabel('Message to user (not required)')
            .setValue('👋 Hey there. This message would fit better in #...')
            .setRequired(false)
            .setStyle(TextInputStyle.Short)
        )
      );

    await interaction.showModal(modal);

    try {
      const submit = await interaction.awaitModalSubmit({
        time: 5 * 60 * 1000,
        filter: (i) => i.user.id === interaction.user.id,
      });
      const modMessage = submit.fields.getTextInputValue('modMessageInput');

      await Promise.all([
        targetMessage.delete(),
        targetMessage.author.send({
          content: `
Your message has been deleted because it was posted in the wrong channel. Feel free to post it again in the correct channel.
${modMessage ? `Moderator message: \`\`\`${modMessage}\`\`\`` : ''}`,
          embeds: [
            {
              title: 'Deleted message:',
              description: originalMessageContent,
            },
          ],
        }),
        submit.reply({
          ephemeral: true,
          content: 'Ok!',
        }),
      ]);
    } catch (err) {
      console.error(err);
    }
  },
};
