import { TextChannel } from 'discord.js';
import { OnReactionHandler, OnStartupHandler } from '../types';
import { isStaff } from '../utils';

/**
 * Alert Reactions module
 * ---
 * When some staff member reacts to a message using the warning emoji (⚠️) the message will be logged in
 * the mod log channel
 */

const MOD_LOG_CHANNEL_ID =
  process.env.MOD_LOG_CHANNEL_ID ?? '763149438951882792';
const TRIGGER_EMOJI = '⚠️';

let isEnabled = false;

// We will keep a memory cache of warned messages to avoid showing multiple warnings
// for the same message if someone reacts, remove the reaction and add it again
const warnedMessageIds: string[] = [];

export const onStartup: OnStartupHandler = async (client) => {
  if (!client.channels.cache.get(MOD_LOG_CHANNEL_ID)) {
    console.warn(
      `No mod-log channel found (using the ID ${MOD_LOG_CHANNEL_ID}), skipping the Alert Reactions module!`
    );

    return;
  }

  isEnabled = true;
};

export const onReactionAdd: OnReactionHandler = async (client, reaction) => {
  if (!isEnabled || reaction.emoji.toString() !== TRIGGER_EMOJI) return;

  const { message } = reaction;
  if (
    !message.guild ||
    !message.author ||
    message.author.id === client.user?.id ||
    warnedMessageIds.includes(message.id)
  ) {
    return;
  }

  const messageAuthor = await message.guild.members.fetch(message.author.id);
  if (!messageAuthor || isStaff(messageAuthor)) return;

  await reaction.users.fetch();

  const membersWhoReacted = await Promise.all(
    reaction.users.cache.map((user) => message.guild?.members.fetch(user.id))
  );

  const staffWhoReacted = membersWhoReacted.filter((user) => isStaff(user));

  // We want to trigger the warning only for staff members but not more than once,
  // this could happen if the bot is restarted (losing the memory cache) and some other staff
  // add a reaction to the message
  if (staffWhoReacted.length !== 1) return;

  const modLogChannel = client.channels.cache.get(
    MOD_LOG_CHANNEL_ID
  ) as TextChannel;

  modLogChannel.send({
    embeds: [
      {
        title: '⚠️ Message Warned',
        description: '```' + message.content + '```',
        color: 16098851,
        author: {
          name: messageAuthor.displayName,
          iconURL: messageAuthor.user.displayAvatarURL(),
        },
        fields: [
          {
            name: 'Author profile',
            value: `<@${messageAuthor.id}>`,
            inline: true,
          },
          {
            name: 'Jump to message',
            value: `[Click here](${message.url})`,
            inline: true,
          },
        ],
        footer: {
          icon_url: staffWhoReacted[0]?.user.displayAvatarURL(),
          text: `Warned by ${staffWhoReacted[0]?.displayName}`,
        },
      },
    ],
  });

  warnedMessageIds.push(message.id);
};
