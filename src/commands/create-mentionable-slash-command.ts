import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { SlashCommand } from '../types';

type Options = {
  name: string;
  description: string;
  reply: {
    title: string;
    content: string;
  };
};

export const createMentionableSlashCommand = ({
  name,
  description,
  reply,
}: Options) => {
  const command: SlashCommand = {
    data: new SlashCommandBuilder()
      .setName(name)
      .setDescription(description)
      .addUserOption((option) =>
        option
          .setName('member')
          .setDescription('The member to send this message')
      ),

    async execute(interaction) {
      const { options } = interaction;

      const target = options.getMember('member');
      const targetId = target instanceof GuildMember ? target.id : null;

      interaction.reply({
        content: targetId ? `<@${targetId}>` : undefined,
        embeds: [
          {
            title: reply.title,
            description: reply.content,
          },
        ],
      });
    },
  };

  return command;
};
