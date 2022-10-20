import { User } from "discord.js";
import { DataSource, DataSourceOptions, Repository } from "typeorm";
import { Logger } from "../utils/logger";

export class DatabaseClient extends DataSource {

  private _user: Repository<User>;

  constructor(options: DataSourceOptions) {
    super(options);

    try {
      this.initialize();
    } catch (error) {
      Logger.error(error);
    } finally {
      Logger.info("Database client initialized.");
    }

    this._user = this.getRepository(User);
  }

  public get user(): Repository<User> {
    return this._user;
  }
}