import { VoiceChannel } from 'discord.js';
import { OnStartupHandler } from '../types';
import { remainingTime } from '../utils';

/**
 * Countdown module
 * ---
 * The bot will keep track of a countdown, updating a voice channel name so all the members can see it
 */

const TITLE_VOICE_CHANNEL_ID = '902455952048029696';
const COUNTDOWN_VOICE_CHANNEL_ID = '902456113298022420';
const TARGET_TIME = '26 Oct 2021 09:00:00 GMT-0700';

let enabled = false;

export const onStartup: OnStartupHandler = async (client) => {
  if (!enabled) return;

  const voiceChannel = client.channels.cache.get(
    COUNTDOWN_VOICE_CHANNEL_ID
  ) as VoiceChannel;

  if (!voiceChannel) {
    console.warn(
      `No countdown voice channel found (using the ID ${COUNTDOWN_VOICE_CHANNEL_ID}), skipping the countdown module!`
    );
    return;
  }

  const targetDate = new Date(TARGET_TIME);

  const updateChannelName = () => {
    if (!enabled) return false;

    const timeDiff = targetDate.getTime() - Date.now();

    if (timeDiff <= 0) {
      const channelName = `Next.js Conf started!`;
      voiceChannel.setName(channelName);

      const titleVoiceChannel = client.channels.cache.get(
        TITLE_VOICE_CHANNEL_ID
      );
      titleVoiceChannel?.delete();

      enabled = false;
      return;
    }

    const { days, hours, minutes } = remainingTime(
      Date.now(),
      targetDate.getTime()
    );

    const channelName = `${days} Days ${hours} Hours ${minutes} Mins`;
    voiceChannel.setName(channelName);
  };

  // We can only update it every 5 minutes (Discord rate limiting)
  const interval = 5 * 1000 * 60;
  setInterval(updateChannelName, interval);
  updateChannelName();
};
