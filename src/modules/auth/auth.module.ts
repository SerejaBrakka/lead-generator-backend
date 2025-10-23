import { Module, forwardRef } from '@nestjs/common';

import { AppConfigModule } from 'src/config/config.module';
import { UsersModule } from 'src/entities/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { HashingService } from './hashing.service';
import { TokenService } from './token.service';

@Module({
  imports: [forwardRef(() => UsersModule), AppConfigModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, HashingService, CookieService],
  exports: [AuthService, TokenService, HashingService],
})
export class AuthModule {}
