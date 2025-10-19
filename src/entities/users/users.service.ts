import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/config.service';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';
import { PasswordService } from 'src/modules/auth/password.service';
import { TokenService } from 'src/modules/auth/token.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { UserRoleEnum } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    private passwordService: PasswordService,
    private tokenService: TokenService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Пользователь с почтой ${createUserDto.email} уже зарегистрирован`,
      );
    }

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(createUserDto.password, salt);

    const id = uuidv4();
    const user = this.userRepository.create({
      id,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      hash,
      salt,
    });

    const defaultRole = await this.rolesRepository.findOne({
      where: { title: UserRoleEnum.USER },
    });

    if (defaultRole) {
      user.role = defaultRole;
    }

    await this.userRepository.save(user);

    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = await this.tokenService.generateTokens({
      id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  async authentificate(authUserDto: AuthUserDto) {
    const { email, password } = authUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'role',
        'hash',
        'salt',
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const hash = this.passwordService.getHash(password, user.salt);

    if (hash !== user.hash) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = await this.tokenService.generateTokens({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['role'],
    });

    return users;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new ConflictException('Юзер не найден');
    }

    return user;
  }

  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new ConflictException('Юзер не найден');
    }

    await this.userRepository.remove(user);

    return user;
  }
}
