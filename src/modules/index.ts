import { Client, MessageReaction, User } from 'discord.js';
import { Handlers } from '../types';
import rulesModule from './rules';
import alertMessageModule from './alertReactions';
import countdownModule from './countdown';

const modules: Handlers[] = [];
modules.push(rulesModule);
modules.push(alertMessageModule);
modules.push(countdownModule);

const actions = {
  onStartup: (client: Client): void => {
    modules.forEach((module) => module.onStartup?.(client));
  },
  onReactionAdd: (
    client: Client,
    reaction: MessageReaction,
    user: User
  ): void => {
    modules.forEach((module) => module.onReactionAdd?.(client, reaction, user));
  },
};

export default actions;
