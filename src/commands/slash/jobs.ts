import { createMentionableSlashCommand } from '../create-mentionable-slash-command';

export const command = createMentionableSlashCommand({
  name: 'jobs',
  description: 'Replies with directions for job posts',
  reply: {
    title: 'Job posts are not allowed in the server',
    content:
      "We currently do not allow job posts in this server, unless it's in the context of a discussion. If you're looking to get hired or to advertise a job vacancy see <#910564441119150100>",
  },
});
