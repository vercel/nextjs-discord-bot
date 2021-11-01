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

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const remainingTime = (
  startTime: number,
  endTime: number
): RemainingTime => {
  // https://stackoverflow.com/a/13904120
  // get total seconds between the times
  let delta = Math.abs(endTime - startTime) / 1000;

  // calculate (and subtract) whole days
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  const seconds = delta % 60; // in theory the modulus is not required

  return { days, hours, minutes, seconds };
};
