import { createMentionableSlashCommand } from '../create-mentionable-slash-command';

export const command = createMentionableSlashCommand({
  name: 'ping',
  description: 'Explains why we disencourage pinging other members',
  reply: {
    title: "Don't ping or DM other devs you aren't actively talking to",
    content:
      "Do not ping other people in order to get attention to your question unless they are actively involved in the discussion. If you're looking to get help, it is a lot better to post your question in a public channel so other people can help or learn from the questions",
  },
});
