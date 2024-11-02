import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Instrument } from "./instrument.entity";

export enum Role {
  ADMIN = "admin",
  MUSICIAN = "musician",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  password: string;

  @Column({ type: "enum", enum: Role })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Instrument, (instrument) => instrument.musicians, {
    cascade: true,
  })
  @JoinTable()
  instruments: Instrument[];
}
