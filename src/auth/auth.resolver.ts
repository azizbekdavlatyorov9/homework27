import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { RegisterInput } from "./dto/register.input";

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
  ) {}

  @Mutation(() => String)
  register(
    @Args("registerInput")
    registerInput: RegisterInput,
  ) {
    return this.authService.register(registerInput);
  }
}