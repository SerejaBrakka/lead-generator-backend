import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { AppConfigService } from 'src/config/config.service';
import {
  AuthUserDto,
  RefreshTokenDto,
} from 'src/modules/auth/dto/auth-user.dto';
import { HashingService } from 'src/modules/auth/hashing.service';
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
    private hashingService: HashingService,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private configService: AppConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    refreshTokenHash: string;
    id: string;
  }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `Пользователь с почтой ${createUserDto.email} уже зарегистрирован`,
      );
    }

    const salt = this.hashingService.getSalt();
    const hash = this.hashingService.hashPassword(createUserDto.password, salt);

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
      refreshTokenHash,
    } = await this.tokenService.generateTokens({
      id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
      id: user.id,
    };
  }

  async authentificate(authUserDto: AuthUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    refreshTokenHash: string;
    id: string;
  }> {
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

    const hash = this.hashingService.hashPassword(password, user.salt);

    if (hash !== user.hash) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
    } = await this.tokenService.generateTokens({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
      id: user.id,
    };
  }

  async updateToken({ refreshToken }: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    refreshTokenHash: string;
    id: string;
  }> {
    const user = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.jwtRefreshSecret,
    });

    if (!user) {
      throw new ConflictException('Refresh token not valid');
    }

    const { id, email } = user;
    const refreshTokenHash = await this.getRefreshTokenHash(id);

    if (!refreshTokenHash) {
      throw new ConflictException('Refresh token revoked');
    }

    if (!refreshTokenHash) {
      throw new ConflictException('Refresh token revoked');
    }

    const isMatch = this.hashingService.compareToken(
      refreshToken,
      refreshTokenHash,
    );

    if (!isMatch) {
      throw new ConflictException('Refresh token revoked');
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash: newRefreshTokenHash,
    } = await this.tokenService.generateTokens({ id, email });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash: newRefreshTokenHash,
      id,
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

  async setRefreshTokenHash(id: string, refreshTokenHash: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['refreshTokenHash'],
    });

    if (!user) {
      throw new ConflictException('Юзер не найден');
    }

    user.refreshTokenHash = refreshTokenHash;
    await this.userRepository.update(id, { refreshTokenHash });
  }

  async getRefreshTokenHash(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new ConflictException('Юзер не найден');
    }
    return user.refreshTokenHash;
  }

  async removeRefreshTokenHash(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) {
      throw new ConflictException('Юзер не найден');
    }

    user.refreshTokenHash = '';

    await this.userRepository.save(user);
  }
}
