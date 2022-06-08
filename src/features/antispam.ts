import { OnMessageHandler } from '../types';
import { isStaff, logAndDelete } from '../utils';

/**
 * Anti spam
 * ---
 * If a message has too many emojis or contains certain keywords, the bot will log the message and delete it
 */

const MAX_EMOJI_COUNT = 16; // Flags are two symbols so 16 max emojis = max of 8 flags
const ROLES_WHITELIST = ['partner']; // Allow partners to go above the emojis limit
const INTRODUCTIONS_CHANNEL_ID = '766393115044216854';

const emojiRegex = /\p{Emoji_Presentation}/gu;
const spamKeywords = ['discord', 'nitro', 'steam', 'free', 'gift'];

const dmMessage =
  'Hello there! Our automated systems detected your message as a spam message and it has been deleted. If this is an error on our side, please feel free to contact one of the moderators.';

export const onMessage: OnMessageHandler = async (client, message) => {
  const messageAuthor = await message.guild?.members.fetch(message.author.id);

  if (
    !messageAuthor ||
    isStaff(messageAuthor) ||
    messageAuthor.roles.cache.some((role) =>
      ROLES_WHITELIST.includes(role.name.toLowerCase())
    )
  )
    return;

  const emojisCount = message.content.match(emojiRegex)?.length ?? 0;

  if (
    emojisCount >
    (message.channelId === INTRODUCTIONS_CHANNEL_ID
      ? MAX_EMOJI_COUNT * 5
      : MAX_EMOJI_COUNT)
  ) {
    await message.author.send(dmMessage);
    await logAndDelete(client, message, 'Too many emojis');
    return;
  }

  const messageHasPingKeywords = ['@everyone', '@here'].some((pingKeyword) =>
    message.content.includes(pingKeyword)
  );
  const messageHasSpamKeywords = message.content
    .split(' ')
    .some((word) => spamKeywords.includes(word.toLowerCase()));

  if (messageHasPingKeywords && messageHasSpamKeywords) {
    await message.author.send(dmMessage);
    await logAndDelete(client, message, 'Spam keywords');
  }
};
