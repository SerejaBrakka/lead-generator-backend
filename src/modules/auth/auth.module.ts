import { Module } from '@nestjs/common';
import { UsersModule } from 'src/entities/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, CookieService],
  exports: [AuthService],
})
export class AuthModule {}
