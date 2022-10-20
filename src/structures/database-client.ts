import { User } from "../entities/user.entity";
import { DataSource, DataSourceOptions, Repository } from "typeorm";
import { Logger } from "../utils/logger";
import { Insult } from "../entities/insult.entity";
import { Channel } from "../entities/channel.entity";

export class DatabaseClient extends DataSource {

  private _user: Repository<User>;
  private _insult: Repository<Insult>;
  private _channel: Repository<Channel>;

  constructor(options: DataSourceOptions) {
    super(options);

    super.initialize().then(() => {
      Logger.info("Database client initialized.");
    }).catch((error) => {
      Logger.error(error);
    });

    this._user = this.getRepository(User);
    this._insult = this.getRepository(Insult);
    this._channel = this.getRepository(Channel);
  }

  public get user(): Repository<User> {
    return this._user;
  }

  public get insult(): Repository<Insult> {
    return this._insult;
  }

  public get channel(): Repository<Channel> {
    return this._channel;
  }
}