import { ClientEvents } from "discord.js";

export interface EventOptions<Key extends keyof ClientEvents> {
  event: Key;
  isLoaded?: boolean;
  execute: (...args: ClientEvents[Key]) => any;
}