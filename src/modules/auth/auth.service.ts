import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/entities/users/dto/create-user.dto';
import { UsersService } from 'src/entities/users/users.service';
import {
  AuthUserDto,
  RecoveryPasswordDto,
  RefreshTokenDto,
} from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(createUserDto: CreateUserDto) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
      id,
    } = await this.usersService.create(createUserDto);

    await this.usersService.setRefreshTokenHash(id, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  async signIn(authUserDto: AuthUserDto) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
      id,
    } = await this.usersService.authentificate(authUserDto);

    await this.usersService.setRefreshTokenHash(id, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  async updateToken({ refreshToken }: RefreshTokenDto) {
    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
      id,
    } = await this.usersService.updateToken({ refreshToken });

    await this.usersService.setRefreshTokenHash(id, refreshTokenHash);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  async recoveryPassword(recoveryPasswordDto: RecoveryPasswordDto) {
    return this.usersService.recoveryPassword(recoveryPasswordDto);
  }
}
