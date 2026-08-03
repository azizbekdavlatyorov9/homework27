import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { BookModule } from "./book/book.module";
import { Book } from "./book/entities/book.entity";
import { AuthModule } from './auth/auth.module';
import { User } from "./auth/entities/user.entity";
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      database: "graphql",
      password: "1234",
      entities: [Book, User],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    BookModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
