import { Event } from '../structures/event';
import { client as instance } from '../index';
import { ActivityType } from 'discord.js';

export default new Event({
  event: "ready",
  isLoaded: true,
  execute: async (client) => {
    client.user.setStatus("online");

    client.user.setPresence({
      activities: [
        {
          name: "with Discord.js",
          type: ActivityType.Playing,
        },
      ],
    });
  }
});