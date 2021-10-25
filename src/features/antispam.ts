import { OnMessageHandler } from '../types';
import { logAndDelete } from '../utils';

/**
 * Anti spam
 * ---
 * If a message has too many emojis or contains certain keywords, the bot will log the message and delete it
 */

const MAX_EMOJI_COUNT = 8; // Flags are two symbols so 8 max emojis = max of 4 flags

const emojiRegex = /\p{Emoji_Presentation}/gu;
const spamKeywords = ['discord', 'nitro', 'steam', 'free', 'gift'];

export const onMessage: OnMessageHandler = async (client, message) => {
  const emojisCount = message.content.match(emojiRegex)?.length ?? 0;

  if (emojisCount > MAX_EMOJI_COUNT) {
    await message.author.send(
      'Hello there! Our automated systems detected your message as a spam message and it has been deleted. If this is an error on our side, please feel free to contact one of the moderators.'
    );
    await logAndDelete(client, message, 'Emoji spam');
    return;
  }

  const messageHasPingKeywords = ['@everyone', '@here'].some((pingKeyword) =>
    message.content.includes(pingKeyword)
  );
  const messageHasSpamKeywords = message.content
    .split(' ')
    .some((word) => spamKeywords.includes(word.toLowerCase()));

  if (messageHasPingKeywords && messageHasSpamKeywords) {
    await logAndDelete(client, message, 'Spam keywords');
  }
};
