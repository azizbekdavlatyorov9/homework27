import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { RegisterInput } from "./dto/register.input";
import * as bcrypt from "bcrypt";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private mailService: MailService,
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
}

