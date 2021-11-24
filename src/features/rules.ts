import { TextChannel } from 'discord.js';
import { OnStartupHandler } from '../types';
/**
 * Rules module
 * ---
 * When the bot starts, it will post the rules defined below into the configured channel.
 * To avoid spamming the channel everytime it is started, the messages existing in the channel
 * are going to be "recycled". This means that if we edit something in the rules, we will try to edit
 * the existing messages to avoid creating pings in the channel.
 */

const RULES_CHANNEL_ID = process.env.RULES_CHANNEL_ID ?? '752553802359505020';
const HELP_CHANNEL_ID = '752668543891276009';
// TODO: Fix these channel IDs
const OFFTOPIC_CHANNEL_ID = '752668543891276009';
const SHOWCASE_CHANNEL_ID = '752668543891276009';
const KUDOS_CHANNEL_ID = '752668543891276009';
const GENERAL_CHANNEL_ID = '752668543891276009';

const RULES_MESSAGES = [
  'https://i.imgur.com/Zqc3Nc6.png',
  `
Welcome to the official Next.js Discord server!

This is the place to chat about Next.js, ask questions, show off your projects, and collaborate with other developers.

**Here's a quick breakdown of our channels:**
<#${GENERAL_CHANNEL_ID}>:: General chat about Next.js
<#${HELP_CHANNEL_ID}>: Ask for help with Next.js
<#${OFFTOPIC_CHANNEL_ID}>: Anything else you want to talk about
<#${SHOWCASE_CHANNEL_ID}>: Show off your Next.js projects
<#${KUDOS_CHANNEL_ID}>: Shout out people who helped you out

We abide by our Code of Conduct. Please read it: <https://github.com/vercel/next.js/blob/canary/CODE_OF_CONDUCT.md>
  `,
  `**Tell us what tools you use** so we can add you to the relevant channels!

  <:javascript:912770918659543090> : JavaScript

  <:typescript:912771149853786204> : TypeScript

  <:tailwind:912770959096811550> : Tailwind

  <:rust:912770947562471465> : Rust
  `,
];

export const onStartup: OnStartupHandler = async (client) => {
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
};
