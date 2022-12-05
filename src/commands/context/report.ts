import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { ContextMenuCommand } from '../../types';
import { isStaff } from '../../utils';

/**
 * Report message command
 * ---
 * Logs a message in the mod log channel. If a normal user uses the command it will ping the mods
 */

// We will keep a memory cache of warned messages to avoid showing multiple warnings
const warnedMessageIds: string[] = [];

export const command: ContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Report')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setType(ApplicationCommandType.Message),

  async execute(interaction) {
    const { client, guild, user, targetMessage } = interaction;

    if (!guild) return;

    const sendSuccessMessage = () => {
      interaction.reply({
        content:
          'Thanks, the message has been reported and the moderators have been notified',
        ephemeral: true,
      });
    };

    if (warnedMessageIds.includes(targetMessage.id)) {
      // Send the success message anyway so they know the mods have been notified
      sendSuccessMessage();
      return;
    }

    const channel = client.channels.cache.get(process.env.MOD_LOG_CHANNEL_ID);

    if (!channel || !channel.isTextBased()) {
      console.error(
        `No mod-log channel found (using the ID ${process.env.MOD_LOG_CHANNEL_ID})!`
      );

      interaction.reply({
        content: 'Something went wrong, please try again later',
        ephemeral: true,
      });

      return;
    }

    const author = await guild.members.fetch(targetMessage.author.id);
    const userGuildMember = await guild.members.fetch(user.id);
    const isUserStaff = isStaff(userGuildMember);

    channel.send({
      content: !isUserStaff
        ? `<@&${process.env.MODERATOR_ROLE_ID}>`
        : undefined,
      embeds: [
        {
          title: '⚠️ Message Reported',
          description: '```' + targetMessage.content + '```',
          color: 16098851,
          author: {
            name: author?.displayName ?? 'Unknown user',
            icon_url: author?.displayAvatarURL(),
          },
          fields: [
            {
              name: 'Author',
              value: `<@${targetMessage.author.id}>`,
              inline: true,
            },
            {
              name: 'Channel',
              value: `<#${targetMessage.channelId}>`,
              inline: true,
            },
            {
              name: 'Jump to message',
              value: `[Click here](${targetMessage.url})`,
              inline: true,
            },
          ],
          footer: {
            icon_url: userGuildMember.displayAvatarURL(),
            text: `Reported by ${userGuildMember.displayName}`,
          },
        },
      ],
    });

    if (isUserStaff) {
      interaction.reply({
        content: 'Message logged in the mod channel',
        ephemeral: true,
      });
    } else {
      sendSuccessMessage();
    }

    warnedMessageIds.push(targetMessage.id);
  },
};
