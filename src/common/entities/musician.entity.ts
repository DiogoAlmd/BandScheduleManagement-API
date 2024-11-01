import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Instrument } from "./instrument.entity";
import { User } from "./user.entity";

@Entity()
export class Musician {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column({ length: 255 })
  fullName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @ManyToMany(() => Instrument, (instrument) => instrument.musicians, {
    cascade: true,
  })
  @JoinTable()
  instruments: Instrument[];
}
