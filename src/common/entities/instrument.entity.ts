import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Musician } from "./musician.entity";

@Entity()
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  name: string;

  @ManyToMany(() => Musician, (musician) => musician.instruments)
  musicians: Musician[];
}
