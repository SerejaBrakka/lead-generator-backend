import { Module } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';
import { UsersModule } from 'src/entities/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { TokenService } from './token.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, CookieService, AppConfigService, TokenService],
  exports: [AuthService],
})
export class AuthModule {}
