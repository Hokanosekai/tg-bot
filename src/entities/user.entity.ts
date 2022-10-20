import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Insult } from "./insult.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn({ 
    type: "varchar",
  })
  public id: string;

  @Column({ 
    type: "int",
    name: "messages_count",
  })
  public messagesCount: number;

  @Column({
    type: "int",
    name: "points",
  })
  public points: number;

  @Column({
    type: "int",
    name: "level",
  })
  public level: number;

  @OneToMany(() => Insult, insult => insult.author)
  public insults: Insult[];
}