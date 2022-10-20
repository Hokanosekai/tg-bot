import { ClientEvents } from "discord.js";
import { EventOptions } from "../types/event.type";

export class Event<Key extends keyof ClientEvents> {
  constructor(options: EventOptions<Key>) {
    Object.assign(this, options);
  }
}