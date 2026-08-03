import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { RegisterInput } from "./dto/register.input";
import { AuthResponse } from "./entities/auth-response.entity";
import { VerifyCodeInput } from "./dto/verify-code.input";
import { LoginInput } from "./dto/login.input";
import { ForgotPasswordInput } from "./dto/forgot-password.input";
import { ResetPasswordInput } from "./dto/reset-password.input";

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

  @Mutation(() => AuthResponse)
verifyCode(
  @Args("verifyCodeInput")
  verifyCodeInput: VerifyCodeInput,
) {
  return this.authService.verifyCode(
    verifyCodeInput,
  );
}

@Mutation(() => String)
login(
  @Args("loginInput")
  loginInput: LoginInput,
) {
  return this.authService.login(
    loginInput,
  );
}

@Mutation(() => AuthResponse)
verifyLoginCode(
  @Args("verifyCodeInput")
  verifyCodeInput: VerifyCodeInput,
) {
  return this.authService.verifyLoginCode(
    verifyCodeInput,
  );
}

@Mutation(() => String)
forgotPassword(
  @Args("forgotPasswordInput")
  forgotPasswordInput: ForgotPasswordInput,
) {
  return this.authService.forgotPassword(
    forgotPasswordInput,
  );
}

@Mutation(() => String)
resetPassword(
  @Args("resetPasswordInput")
  resetPasswordInput: ResetPasswordInput,
) {
  return this.authService.resetPassword(
    resetPasswordInput,
  )

}
}