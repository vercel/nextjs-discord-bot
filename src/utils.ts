import { Client, GuildMember, Message, TextChannel } from 'discord.js';

const MOD_LOG_CHANNEL_ID =
  process.env.MOD_LOG_CHANNEL_ID ?? '763149438951882792';

const staffRoles = ['next.js', 'moderator', 'vercel'];

export const isStaff = (member: GuildMember | null | undefined): boolean => {
  if (!member) return false;

  return member.roles.cache.some((role) =>
    staffRoles.includes(role.name.toLowerCase())
  );
};

export const logAndDelete = async (
  client: Client,
  message: Message,
  reason: string
) => {
  const modLogChannel = client.channels.cache.get(
    MOD_LOG_CHANNEL_ID
  ) as TextChannel;

  await modLogChannel.send({
    embeds: [
      {
        title: 'Message automatically deleted',
        description: '```' + message.content + '```',
        color: 16098851,
        fields: [
          {
            name: 'Author profile',
            value: `<@${message.author.id}>`,
            inline: true,
          },
          {
            name: 'Reason',
            value: reason,
            inline: true,
          },
          {
            name: 'Channel',
            value: `<#${message.channel.id}>`,
            inline: true,
          },
        ],
      },
    ],
  });

  message.delete();
};
