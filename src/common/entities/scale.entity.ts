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
import { ScaleMusician } from "./scale-musician.entity";

@Entity()
export class Scale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "timestamp" })
  eventDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  createdBy: User;

  @OneToMany(() => ScaleMusician, (scaleMusician) => scaleMusician.scale, {
    cascade: true,
    onDelete: "CASCADE",
  })
  scaleMusician: ScaleMusician[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
