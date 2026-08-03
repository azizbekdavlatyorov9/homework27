import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { User } from "./entities/user.entity";
import { RegisterInput } from "./dto/register.input";
import { LoginInput } from "./dto/login.input";
import { VerifyCodeInput } from "./dto/verify-code.input";
import { MailService } from "../mail/mail.service";
import { AuthResponse } from "./entities/auth-response.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly mailService: MailService,

    private readonly jwtService: JwtService,
  ) {}

  // ================= OTP =================

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async validateOtp(
    email: string,
    code: string,
  ): Promise<User> {
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

    if (!user.otpTime || Number(user.otpTime) < Date.now()) {
      throw new UnauthorizedException("OTP expired");
    }

    return user;
  }

  private async generateToken(
    user: User,
    message: string,
  ): Promise<AuthResponse> {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      message,
    };
  }

  // ================= REGISTER =================

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

  // ================= VERIFY REGISTER =================

  async verifyCode(
    verifyCodeInput: VerifyCodeInput,
  ): Promise<AuthResponse> {
    const user = await this.validateOtp(
      verifyCodeInput.email,
      verifyCodeInput.code,
    );

    user.code = "";
    user.otpTime = 0;
    user.isVerified = true;

    await this.userRepo.save(user);

    return this.generateToken(user, "Successfully verified");
  }

  // ================= LOGIN =================

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
      throw new UnauthorizedException("Invalid password");
    }

    const code = this.generateOtp();

    user.code = code;
    user.otpTime = Date.now() + 120000;

    await this.userRepo.save(user);

    await this.mailService.sendOtp(email, code);

    return "Check your email";
  }

  // ================= VERIFY LOGIN =================

  async verifyLoginCode(
    verifyCodeInput: VerifyCodeInput,
  ): Promise<AuthResponse> {
    const user = await this.validateOtp(
      verifyCodeInput.email,
      verifyCodeInput.code,
    );

    user.code = "";
    user.otpTime = 0;

    await this.userRepo.save(user);

    return this.generateToken(user, "Login successful");
  }
}