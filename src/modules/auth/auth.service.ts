import { Injectable, UnauthorizedException } from '@nestjs/common';
import express from 'express';
import { AppConfigService } from 'src/config/config.service';
import { CreateUserDto } from 'src/entities/users/dto/create-user.dto';
import { UsersService } from 'src/entities/users/users.service';
import { CookieService } from './cookie.service';
import {
  AuthResponseDto,
  AuthUserDto,
  RefreshTokenDto,
} from './dto/auth-user.dto';
import { HashingService } from './hashing.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
    private readonly configService: AppConfigService,
    private readonly hashingService: HashingService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
    res: express.Response,
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.create(createUserDto);

    const { id, email } = user;

    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
    } = await this.tokenService.generateTokens({
      id,
      email,
    });

    this.usersService.setRefreshTokenHash(id, refreshTokenHash);

    this.cookieService.setToken({
      res,
      key: this.configService.jwtAccessKey,
      token: accessToken,
      expiresIn: accessTokenExpires,
    });

    this.cookieService.setToken({
      res,
      key: this.configService.jwtRefreshKey,
      token: refreshToken,
      expiresIn: refreshTokenExpires,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      ...user,
    };
  }

  async signIn(
    authUserDto: AuthUserDto,
    res: express.Response,
  ): Promise<AuthResponseDto> {
    const user = await this.usersService.checkCredentials(authUserDto);

    const { id, email } = user;

    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
    } = await this.tokenService.generateTokens({
      id,
      email,
    });

    this.usersService.setRefreshTokenHash(id, refreshTokenHash);

    this.cookieService.setToken({
      res,
      key: this.configService.jwtAccessKey,
      token: accessToken,
      expiresIn: accessTokenExpires,
    });

    this.cookieService.setToken({
      res,
      key: this.configService.jwtRefreshKey,
      token: refreshToken,
      expiresIn: refreshTokenExpires,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      ...user,
    };
  }

  async updateToken({
    refreshToken,
  }: RefreshTokenDto): Promise<AuthResponseDto> {
    const user = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException('Refresh token not valid');
    }

    const { id, email } = user;

    const refreshTokenHash = await this.usersService.getRefreshTokenHash(id);

    if (!refreshTokenHash) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const isMatch = this.hashingService.compareToken(
      refreshToken,
      refreshTokenHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Refresh token not valid');
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash: newRefreshTokenHash,
    } = await this.tokenService.generateTokens({
      id,
      email,
    });

    await this.usersService.setRefreshTokenHash(id, newRefreshTokenHash);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      ...user,
    };
  }
}
