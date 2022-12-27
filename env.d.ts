declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Required env variables
      DISCORD_BOT_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      MOD_LOG_CHANNEL_ID: string;
      // Optional env variables
      HELP_FORUM_CHANNEL_ID: string;
      HELP_FORUM_AUTO_ANSWER_CHANNEL_ID: string;
      OPENAI_EMAIL: string;
      OPENAI_PASSWORD: string;
      OPENAI_SESSION_TOKEN: string;
      OPENAI_CLEARANCE_TOKEN: string;
      OPENAI_USER_AGENT: string;
      KEYV_URI: string;
      HELP_FORUM_PLUS_ONE_EMOJI_NAME: string;
      HELP_FORUM_APPROVED_EMOJI_NAME: string;
      HELP_FORUM_AUTO_ANSWER_MIN_APPROVALS: string;
      HELP_FORUM_SHOW_COMMUNITY_MEMBERS: string;
    }
  }
}

export {};
