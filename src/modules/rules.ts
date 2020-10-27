import { TextChannel } from 'discord.js';
import { Handlers } from '../types';

/**
 * Rules module
 * ---
 * When the bot starts, it will post the rules defined below into the configured channel.
 * To avoid spamming the channel everytime it is started, the messages existing in the channel
 * are going to be "recycled". This means that if we edit something in the rules, we will try to edit
 * the existing messages to avoid creating pings in the channel.
 */

const RULES_CHANNEL_ID = '752553802359505020';

const MODERATOR_ROLE_ID = '752637460550385834';

const RULES_MESSAGES = [
  'https://i.imgur.com/Zqc3Nc6.png',
  `
Welcome to the official Next.js Discord server!

Join for Next.js Conf, stay for the Community!

Please consider this Discord "under construction" until the day of Next.js Conf :construction_site:

On October 27, this will be our primary place to make Next.js Conf announcements and gather questions for presenters' live Q&A. The best part about Discord is your freedom to join or begin conversations that lead to more knowledge, greater insight, or even a laugh!

Please read our Code of Conduct. All of its contents are applied to this server: <https://github.com/vercel/next.js/blob/canary/CODE_OF_CONDUCT.md>

If you see someone misbehaving, ping the <@&${MODERATOR_ROLE_ID}> role.

If you want to contribute to Next.js, please read our contributing guide: <https://github.com/vercel/next.js/blob/canary/contributing.md>

Type \`/nick\` to change your nickname on this server.
  `,
];

const handlers: Handlers = {
  onStartup: async (client) => {
    const channel = client.channels.cache.get(RULES_CHANNEL_ID) as TextChannel;

    if (!channel) {
      console.warn(
        `No rules channel found (using the ID ${RULES_CHANNEL_ID}), skipping the rules module!`
      );
      return;
    }

    const channelMessages = await channel.messages.fetch({ limit: 100 });

    // Filter only the messages from the bot
    const channelMessagesFromBot = channelMessages.filter(
      (m) => m.author.id === client.user?.id
    );

    // Sort the messages from oldest to newest (so they match the same order of the rules)
    const channelMessagesReversed = [
      ...channelMessagesFromBot.values(),
    ].reverse();

    // For each message sent in the channel...
    for (let i = 0; i < channelMessagesReversed.length; i++) {
      const message = channelMessagesReversed[i];

      // We first check if there is no rule message matching this position,
      // this means that we have more messages in the channel than in our rules, so
      // we need to delete this message (and this is going to be true to all the next messages)
      if (!RULES_MESSAGES[i]) {
        await message.delete();
        continue;
      }

      // If the content of the message doesn't match the respective message in the rules, edit it
      if (message.content !== RULES_MESSAGES[i]) {
        await message.edit(RULES_MESSAGES[i]);
      }
    }

    // And in the end, check if there are more messages in the rules than in the channel,
    // this means that we didn't have enough messages to edit so we need to create more
    const messagesLeftToCreate =
      RULES_MESSAGES.length - channelMessagesReversed.length;

    if (messagesLeftToCreate > 0) {
      // Grab the last n messages from the rules...
      const remainingMessages = RULES_MESSAGES.slice(
        Math.max(RULES_MESSAGES.length - messagesLeftToCreate, 0)
      );

      // And create them!
      await Promise.all(
        remainingMessages.map((message) => channel.send(message))
      );
    }
  },
};

export default handlers;
