import { Client, ClientOptions, REST, Routes } from "discord.js";
import { CommandType } from "../types/command.type";
import { globPromise } from "../utils/glob-promise";

export class DiscordClient extends Client {

  commands: Map<string, CommandType> = new Map();

  constructor(options: ClientOptions) {
    super(options);
    this.rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
  }

  static async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async loadEvents() {
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
    eventFiles.forEach(async (file) => {
      const event: any = await DiscordClient.importFile(file);
      if (event && event.isLoaded) {
        this.on(event.event, event.execute);
      }
    });
  }

  async loadCommands() {
    const commandFiles = await globPromise(`${__dirname}/../commands/*{.ts,.js}`);
    commandFiles.map(async (file) => {
      const command: CommandType = await DiscordClient.importFile(file);
      if (command && command?.isLoaded) {
        this.commands.set(command.name, command);
      }
    });
  }

  async registerCommands() {
    await this.loadCommands();
    await this.rest.put(
      Routes.applicationCommands(this.user.id),
      { body: [...this.commands.values()] }
    );
  }

  async start() {
    await this.loadEvents();

    this.on("ready", async () => {
      await this.registerCommands();
      console.log("Bot is ready!");
    });

    this.login(process.env.DISCORD_TOKEN);
  }  
}