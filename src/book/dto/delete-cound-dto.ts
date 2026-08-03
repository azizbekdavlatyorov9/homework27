import {Int, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteBookCount {
  @Field(() => Int)
  deleteCount!: number;
  
}
