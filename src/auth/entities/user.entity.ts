import { ObjectType, Field, Int } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity("users")
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  username!: string;

  @Field()
  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    nullable: true,
  })
  code!: string;

  @Column({
    nullable: true,
    type: "bigint",
  })
  otpTime!: number;

  @Column({
    default: false,
  })
  isVerified!: boolean;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}