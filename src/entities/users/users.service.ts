import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthUserDto,
  RecoveryPasswordDto,
} from 'src/modules/auth/dto/auth-user.dto';
import { HashingService } from 'src/modules/auth/hashing.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { UserFieldEnum, UserRoleEnum } from './enums/user.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
    private hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
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

    return this.userRepository.save(user);
  }

  async checkCredentials(authUserDto: AuthUserDto): Promise<UserResponseDto> {
    const { email, password } = authUserDto;

    const user = await this.findUser({
      field: UserFieldEnum.EMAIL,
      value: email,
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
      relations: ['role'],
    });

    const hash = this.hashingService.hashPassword(password, user.salt);

    if (hash !== user.hash) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return user;
  }

  async recoveryPassword(recoveryPasswordDto: RecoveryPasswordDto) {
    const user = await this.findUser({
      field: UserFieldEnum.EMAIL,
      value: recoveryPasswordDto.email,
      relations: ['role'],
      select: ['id', 'email', 'firstName', 'hash', 'salt'],
    });

    if (
      recoveryPasswordDto.newPassword !== recoveryPasswordDto.confirmPassword
    ) {
      throw new ConflictException('Пароли не совпадают');
    }

    const currentPasswordHash = this.hashingService.hashPassword(
      recoveryPasswordDto.password,
      user.salt,
    );

    if (currentPasswordHash !== user.hash) {
      throw new ConflictException('Неверный текущий пароль пароль');
    }

    const salt = this.hashingService.getSalt();
    const hash = this.hashingService.hashPassword(
      recoveryPasswordDto.newPassword,
      salt,
    );

    user.hash = hash;
    user.salt = salt;

    await this.userRepository.save(user);

    return {
      code: 200,
      message: 'Пароль успешно изменен',
    };
  }

  async findUser({
    field,
    value,
    select,
    relations,
  }: FindUserDto): Promise<UserEntity> {
    const whereCondition = {
      [field]: value,
    } as FindOptionsWhere<UserEntity>;

    const user = await this.userRepository.findOne({
      where: whereCondition,
      select,
      relations,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
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
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role'],
    });

    if (!user) {
      throw new ConflictException('Юзер не найден');
    }

    return user;
  }

  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.findUser({ field: UserFieldEnum.ID, value: id });

    await this.userRepository.remove(user);

    return user;
  }

  async setRefreshTokenHash(id: string, refreshTokenHash: string) {
    const user = await this.findUser({
      field: UserFieldEnum.ID,
      value: id,
      select: ['id', 'refreshTokenHash'],
    });

    user.refreshTokenHash = refreshTokenHash;
    await this.userRepository.update(id, { refreshTokenHash });
  }

  async getRefreshTokenHash(id: string) {
    const user = await this.findUser({ field: UserFieldEnum.ID, value: id });

    return user.refreshTokenHash;
  }

  async removeRefreshTokenHash(id: string) {
    const user = await this.findUser({ field: UserFieldEnum.ID, value: id });

    user.refreshTokenHash = '';

    await this.userRepository.save(user);
  }
}
