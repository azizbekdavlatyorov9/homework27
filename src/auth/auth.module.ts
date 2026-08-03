import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { User } from "./entities/user.entity";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    ConfigModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("SECRET_KEY"),
        signOptions: {
          expiresIn: "1d",
        },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}