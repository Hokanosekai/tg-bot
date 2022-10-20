import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "insults" })
export class Insult {
  @PrimaryColumn({ 
    type: "varchar",
  })
  public id: string;

  @Column({ 
    type: "varchar",
  })
  public insult: string;

  @ManyToOne(() => User, user => user.insults)
  public author: User;
}