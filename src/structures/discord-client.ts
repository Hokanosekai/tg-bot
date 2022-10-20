import { Client, ClientOptions, Collection, REST, Routes } from "discord.js";
import { Channel } from "../entities/channel.entity";
import { Insult } from "../entities/insult.entity";
import { User } from "../entities/user.entity";
import { CommandType } from "../types/command.type";
import { globPromise } from "../utils/glob-promise";
import { Logger } from "../utils/logger";
import { DatabaseClient } from "./database-client";

export class DiscordClient extends Client {

  private _commands: Collection<string, CommandType> = new Collection();
  private _database: DatabaseClient;

  constructor(options: ClientOptions) {
    super(options);
    this.rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
    this._database = new DatabaseClient({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Insult, Channel],
      synchronize: true,
      logging: false
    });
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
        Logger.success(`Loaded event ${event.event}`);
      }
    });
  }

  async loadCommands() {
    const commandFiles = await globPromise(`${__dirname}/../commands/*{.ts,.js}`);
    commandFiles.map(async (file) => {
      const command: CommandType = await DiscordClient.importFile(file);
      if (command && command?.isLoaded) {
        this._commands.set(command.name, command);
        Logger.success(`Loaded command ${command.name}`);
      }
    });
  }

  async registerCommands() {
    try {
      const data: [] = await this.rest.put(
        Routes.applicationCommands(this.user.id),
        { body: [...this._commands
          .reduce((acc, c) => [
            ...acc,
            {
              name: c.name,
              description: c.description,
              options: c.options
            }
          ], []
          )
        ] 
        }
      ) as [];
      Logger.success(`Successfully registered ${data.length} commands.`);
    } catch (error) {
      Logger.error(error);
    }
  }

  async start() {
    await this.loadCommands();
    await this.loadEvents();

    this.on("ready", async () => {
      await this.registerCommands();
      Logger.info("Bot is ready!");
    });

    this.login(process.env.DISCORD_TOKEN);
  }

  public get commands(): Map<string, CommandType> {
    return this._commands;
  }

  public get database(): DatabaseClient {
    return this._database;
  }
}