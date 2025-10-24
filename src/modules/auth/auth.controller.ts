import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import express from 'express';
import { AppConfigService } from 'src/config/config.service';
import { CreateUserDto } from 'src/entities/users/dto/create-user.dto';
import { UserResponseDto } from 'src/entities/users/dto/response-user.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import {
  AuthUserDto,
  GetSessionInfoDto,
  RecoveryPasswordDto,
  RefreshTokenDto,
} from './dto/auth-user.dto';
import { SessionInfo } from './session-info.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly configService: AppConfigService,
  ) {}

  @ApiCreatedResponse({ type: UserResponseDto })
  @Post('sign-up')
  async signUp(
    @Body() CreateUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = await this.authService.signUp(CreateUserDto);
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
  }

  @ApiCreatedResponse({ type: UserResponseDto })
  @Post('sign-in')
  async signIn(
    @Body() AuthUserDto: AuthUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = await this.authService.signIn(AuthUserDto);

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
    };
  }

  @Post('recovery-password')
  async recoveryPassword(@Body() recoveryPasswordDTO: RecoveryPasswordDto) {
    return this.authService.recoveryPassword(recoveryPasswordDTO);
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard)
  async refreshToken(
    @Body()
    refreshToken: RefreshTokenDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = await this.authService.updateToken(refreshToken);

    this.cookieService.setToken({
      res,
      key: this.configService.jwtAccessKey,
      token: accessToken,
      expiresIn: accessTokenExpires,
    });

    this.cookieService.setToken({
      res,
      key: this.configService.jwtRefreshKey,
      token: newRefreshToken,
      expiresIn: refreshTokenExpires,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  @Get('sign-out')
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: express.Response) {
    return this.cookieService.removeTokens(res);
  }

  @Get('session')
  @UseGuards(AuthGuard)
  getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
    return session;
  }
}
