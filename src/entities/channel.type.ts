import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "channels" })
export class Channel {
  @PrimaryColumn({ 
    type: "varchar",
  })
  public id: string;

  @Column({ 
    type: "varchar",
  })
  public name: string;

  @Column({
    type: "varchar",
    name: "guild_id",
  })
  public guildId: string;
}