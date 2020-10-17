import { GuildMember } from 'discord.js';

const staffRoles = ['next.js', 'moderator', 'vercel'];

export const isStaff = (member: GuildMember | null | undefined): boolean => {
  if (!member) return false;

  return member.roles.cache.some((role) =>
    staffRoles.includes(role.name.toLowerCase())
  );
};
