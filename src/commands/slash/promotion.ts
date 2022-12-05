import { createMentionableSlashCommand } from '../create-mentionable-slash-command';

export const command = createMentionableSlashCommand({
  name: 'promotion',
  description: 'Replies with the server rules for promotion',
  reply: {
    title: 'Promotion is not allowed outside the respective channels',
    content:
      "We have a few channels that allow for self-promotion (<#771729272074534922>, <#1024406585012924486>). Sharing promotional links such as referral links, giveaways/contests or anything that would be a plain advertisement is discouraged and may be removed.\n\nIf what you want to share doesn't fit the promotion channels, contact a moderator to know if the post is valid before posting it.",
  },
});
