import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/entities/users/dto/create-user.dto';
import { UsersService } from 'src/entities/users/users.service';
import { AuthUserDto, RefreshTokenDto } from './dto/auth-user.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    return await this.tokenService.refreshToken({ refreshToken });
  }

  async signIn(authUserDto: AuthUserDto) {
    return await this.usersService.authentificate(authUserDto);
  }
}
