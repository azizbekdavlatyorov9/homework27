import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class VerifyCodeInput {
  @Field()
  email!: string;

  @Field()
  code!: string;
}