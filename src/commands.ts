import path from 'path';
import fs from 'fs';
import { ContextMenuCommandFile } from './types';
import { isJsOrTsFile } from './utils';

export const contextMenuCommands = fs
  .readdirSync(path.resolve(__dirname, './commands/context'))
  .filter(isJsOrTsFile)
  .map((file) => {
    const { command } =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(`./commands/context/${file}`) as ContextMenuCommandFile;
    return command;
  });

export const allCommands = () => {
  return [...contextMenuCommands];
};
