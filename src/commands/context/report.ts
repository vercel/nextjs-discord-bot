import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { ContextMenuCommand } from '../../types';

export const command: ContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Report')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setType(ApplicationCommandType.Message),

  execute(interaction) {
    interaction.reply('test');
  },
};
