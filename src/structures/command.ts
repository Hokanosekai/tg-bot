import { CommandOptions } from "../types/command.type";

export class Command {
  constructor(options: CommandOptions) {
    Object.assign(this, options);
  }
}
