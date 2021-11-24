/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { OnReactionAddHandler } from '../types';

/**
 * Welcome Questions Module
 * ---
 * The bot will keep track of the reactions to a message to assign users certain roles which then adds them to the relevant channels
 */

type LanguageObject = {
  [key: string]: string;
};

const LANGUAGES: LanguageObject = {
  javascript: '912748578907242516',
  typescript: '912748650860539965',
  tailwind: '912748812731301958',
  rust: '912748739284844614',
};

// Make sure to update this message ID when bot generates a new one
const LANGUAGES_MESSAGE_ID = '912915948422434837';

export const onReactionAdd: OnReactionAddHandler = async (
  client,
  reaction,
  user
) => {
  const { message } = reaction;

  // if message isn't the welcome message, exit
  if (message.id !== LANGUAGES_MESSAGE_ID) {
    console.log('msg is NOT in the welcome channel');
    return;
  } else {
    console.log('msg is in the welcome channel');
  }

  // If reaction isn't one of the ones provided above, exit
  if (!Object.keys(LANGUAGES).includes(reaction.emoji.name!)) {
    console.log('emoji is NOT in there');
    return;
  } else {
    console.log('emoji is in there');
  }

  // Now we've certified a valid emoji and message ID, assign role to user
  const member = await message
    .guild!.members.fetch(user.id)
    .catch((err) => console.log(err.message));
  if (!member) return;

  const language = LANGUAGES[reaction.emoji.toString().split(':')[1]];
  member.roles.add(language).catch((err) => console.log(err.message));
};
