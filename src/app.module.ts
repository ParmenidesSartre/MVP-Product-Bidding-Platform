import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { ModuleModule } from './module/module.module';
import { MailService } from './email/email.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    RoleModule,
    ModuleModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, MailService],
})
export class AppModule {}
