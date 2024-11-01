import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Scale } from "./scale.entity";
import { User } from "./user.entity";
import { Instrument } from "./instrument.entity";

@Entity()
export class ScaleMusicianInstrument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Scale, (scale) => scale.scaleMusicianInstruments, {
    onDelete: "CASCADE",
  })
  scale: Scale;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  musician: User;

  @ManyToOne(() => Instrument, { onDelete: "CASCADE" })
  instrument: Instrument;
}
