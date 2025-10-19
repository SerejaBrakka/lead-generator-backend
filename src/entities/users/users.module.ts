import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/config.service';
import { PasswordService } from 'src/modules/auth/password.service';
import { TokenService } from 'src/modules/auth/token.service';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [UsersService, PasswordService, TokenService, AppConfigService],
  exports: [UsersService],
})
export class UsersModule {}
