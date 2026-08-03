import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { RegisterInput } from "./dto/register.input";
import * as bcrypt from "bcrypt";
import { MailService } from "../mail/mail.service";
import { JwtService } from "@nestjs/jwt";
import { AuthResponse } from "./entities/auth-response.entity";
import { VerifyCodeInput } from "./dto/verify-code.input";
import { LoginInput } from "./dto/login.input";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private mailService: MailService,

    private jwtService: JwtService,
  ) {}
  private generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


async register(registerInput: RegisterInput): Promise<string> {
  const { username, email, password } = registerInput;

  const foundedUser = await this.userRepo.findOne({
    where: { email },
  });

  if (foundedUser) {
    throw new ConflictException("Email already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const code = this.generateOtp();

  const user = this.userRepo.create({
    username,
    email,
    password: hashPassword,
    code,
    otpTime: Date.now() + 120000,
  });

  await this.userRepo.save(user);

  await this.mailService.sendOtp(email, code);

  return "Please check your email";
}



async verifyCode(
  verifyCodeInput: VerifyCodeInput,
): Promise<AuthResponse> {

  const { email, code } = verifyCodeInput;

  const user = await this.userRepo.findOne({
    where: { email },
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (!user.code) {
    throw new UnauthorizedException("OTP not found");
  }

  if (user.code !== code) {
    throw new UnauthorizedException("Invalid OTP");
  }

  if (
    user.otpTime &&
    Number(user.otpTime) < Date.now()
  ) {
    throw new UnauthorizedException("OTP expired");
  }

  user.code = "";

  user.otpTime = 0;

  user.isVerified = true;

  await this.userRepo.save(user);

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = await this.jwtService.signAsync(payload);

  return {
    accessToken: token,
    message: "Successfully verified",
  };
}

async login(loginInput: LoginInput): Promise<string> {
  const { email, password } = loginInput;

  const user = await this.userRepo.findOne({
    where: { email },
  });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (!user.isVerified) {
    throw new UnauthorizedException(
      "Please verify your account first",
    );
  }

  const compare = await bcrypt.compare(
    password,
    user.password,
  );

  if (!compare) {
    throw new UnauthorizedException(
      "Invalid password",
    );
  }

  const code = this.generateOtp();

  user.code = code;
  user.otpTime = Date.now() + 120000;

  await this.userRepo.save(user);

  await this.mailService.sendOtp(
    email,
    code,
  );

  return "Check your email";
}

async verifyLoginCode(
  verifyCodeInput: VerifyCodeInput,
): Promise<AuthResponse> {

  const { email, code } = verifyCodeInput;

  const user = await this.userRepo.findOne({
    where: { email },
  });

  if (!user)
    throw new NotFoundException("User not found");

  if (!user.code)
    throw new UnauthorizedException("OTP not found");

  if (user.code !== code)
    throw new UnauthorizedException("Wrong OTP");

  if (
    user.otpTime &&
    Number(user.otpTime) < Date.now()
  )
    throw new UnauthorizedException(
      "OTP expired",
    );

  user.code = "";
  user.otpTime = 0;

  await this.userRepo.save(user);

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token =
    await this.jwtService.signAsync(
      payload,
    );

  return {
    accessToken: token,
    message: "Login successful",
  };
}

}

