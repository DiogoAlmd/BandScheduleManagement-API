import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Scale } from "./scale.entity";
import { User } from "./user.entity";
import { Instrument } from "./instrument.entity";

@Entity()
export class ScaleMusician {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Scale, (scale) => scale.scaleMusician, {
    onDelete: "CASCADE",
  })
  scale: Scale;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  musician: User;

  @ManyToMany(() => Instrument, { onDelete: "CASCADE" })
  @JoinTable()
  instruments: Instrument[];
}
