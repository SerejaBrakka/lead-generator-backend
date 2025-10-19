import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/entities/users/dto/create-user.dto';
import { UsersService } from 'src/entities/users/users.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async signIn(authUserDto: AuthUserDto) {
    return await this.usersService.authentificate(authUserDto);
  }
}
