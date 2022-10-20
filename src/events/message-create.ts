import { client } from "..";
import { Event } from "../structures/event"

export default new Event({
  event: "messageCreate",
  isLoaded: true,
  execute: async (message) => {
    if (message.author.bot) return;
  }
})