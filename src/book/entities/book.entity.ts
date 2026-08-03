import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({name:"book"})
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'Example field (placeholder)' })
  id!: number;

  @Column()
  @Field(() => String)
  title!:string;

  @Column()
  @Field(() => String)
  author!:string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt!:Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt!:Date;
}
