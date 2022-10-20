import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, Interaction } from "discord.js";
import { DiscordClient } from "../structures/discord-client";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember
}

export interface RunOptions {
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
  client: DiscordClient;
}

export type RunFunction = (options: RunOptions) => Promise<void>;

export interface CommandOptions extends ChatInputApplicationCommandData {
  run: RunFunction;
  isLoaded?: boolean;
}

export type CommandType = {
  run: RunFunction;
  isLoaded?: boolean;
} & ChatInputApplicationCommandData;
