import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, Interaction } from "discord.js";
import { User } from "../entities/user.entity";
import { DiscordClient } from "../structures/discord-client";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember
}

export interface RunOptions {
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
  client: DiscordClient;
  user: User;
}

export type RunFunction = (options: RunOptions) => Promise<any>;

export interface CommandOptions extends ChatInputApplicationCommandData {
  run: RunFunction;
  isLoaded?: boolean;
}

export type CommandType = {
  run: RunFunction;
  isLoaded?: boolean;
} & ChatInputApplicationCommandData;
