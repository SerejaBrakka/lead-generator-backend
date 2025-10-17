import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { UserRoleEnum } from './enums/user-role.enum';
import { PasswordService } from 'src/modules/auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    private passwordService: PasswordService,
    private jwtService: JwtService,
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

    console.log('save user', user);
    await this.userRepository.save(user);

    const accessToken = await this.jwtService.signAsync({
      id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  async authentificate(authUserDto: AuthUserDto) {
    const { email, password } = authUserDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect(['user.salt', 'user.hash'])
      .leftJoinAndSelect('user.role', 'role')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const hash = this.passwordService.getHash(password, user.salt);

    if (hash !== user.hash) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .getMany();

    return plainToInstance(UserResponseDto, users);
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
