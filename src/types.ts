import { Client } from 'discord.js';

export type Handlers = {
  onStartup?: (client: Client) => Promise<void>;
};
