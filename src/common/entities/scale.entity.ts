import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { ScaleMusicianInstrument } from "./scale-musician-instrument.entity";

@Entity()
export class Scale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  eventDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  createdBy: User;

  @OneToMany(
    () => ScaleMusicianInstrument,
    (scaleMusicianInstrument) => scaleMusicianInstrument.scale,
    {
      cascade: true,
    },
  )
  scaleMusicianInstruments: ScaleMusicianInstrument[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
