import rulesModule from './rules';
import { Handlers } from '../types';
import { Client } from 'discord.js';

const modules: Handlers[] = [];
modules.push(rulesModule);

const actions = {
  startup: (client: Client): void => {
    modules.forEach((module) => module.onStartup?.(client));
  },
};

export default actions;
