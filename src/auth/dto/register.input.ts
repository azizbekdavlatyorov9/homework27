import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, MinLength } from "class-validator";

@InputType()
export class RegisterInput {
  @Field()
  username!: string;

  @IsEmail()
  @Field()
  email!: string;

  @MinLength(6)
  @Field()
  password!: string;
}