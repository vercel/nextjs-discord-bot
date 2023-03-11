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
const INTRO_CHANNEL_ID = '766393115044216854';
const FEEDBACK_CHANNEL_ID = '843997308616966145';

const RULES_MESSAGES = [
  'https://i.imgur.com/r9Etfje.png',
  `
‎
👋 Welcome to the official Next.js Discord server! This is the place to chat about Next.js, ask questions, show off your projects, and collaborate with other developers.

📖 We abide by our Code of Conduct. Please read it: <https://github.com/vercel/next.js/blob/canary/CODE_OF_CONDUCT.md>

🙋 Introduce yourself in the <#${INTRO_CHANNEL_ID}> channel, we'd love to learn more about you and what you're working on!

✨ Customize your profile in <id:customize> by adding your own name color or custom roles

📜 **Server Rules**

1. Treat everyone with respect. No NFSW content or spam
2. No self-promotion (server invites, advertisements, etc.) outside the correct channels. This includes DMing fellow members
3. Job posts in this server are not allowed, refer to #jobs if you want to hire someone or are looking for a job
4. Do not DM members randomly
5. Do not mention (\`@ping\`) people not in the conversation
6. Do not use an avatar, nickname, or profile that breaks any of the rules
7. Moderators will delete messages posted on the wrong channel, please read the channel descriptions before posting
8. Bumping posts in #help-forum is allowed to avoid having it going down the list if you still need help. Do not do it more than once a day

If you see something against the rules or something that makes you feel unsafe, let the staff know. We want this server to be a welcoming space!
We are always looking to improve the server. Feel free to share your ideas or opinions in <#${FEEDBACK_CHANNEL_ID}>
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
