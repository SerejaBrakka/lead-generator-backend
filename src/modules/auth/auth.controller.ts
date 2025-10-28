import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import express from 'express';
import { CreateUserDto } from 'src/entities/users/dto/create-user.dto';
import { UserResponseDto } from 'src/entities/users/dto/response-user.dto';
import { UserFieldEnum } from 'src/entities/users/enums/user.enum';
import { UsersService } from 'src/entities/users/users.service';
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
    private readonly userService: UsersService,
  ) {}

  @ApiCreatedResponse({ type: UserResponseDto })
  @Post('sign-up')
  async signUp(
    @Body() CreateUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return await this.authService.signUp(CreateUserDto, res);
  }

  @ApiCreatedResponse({ type: UserResponseDto })
  @Post('sign-in')
  async signIn(
    @Body() AuthUserDto: AuthUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return await this.authService.signIn(AuthUserDto, res);
  }

  @Post('recovery-password')
  async recoveryPassword(@Body() recoveryPasswordDTO: RecoveryPasswordDto) {
    return this.userService.recoveryPassword(recoveryPasswordDTO);
  }

  @Post('refresh-token')
  @UseGuards(AuthGuard)
  async refreshToken(
    @Body()
    refreshToken: RefreshTokenDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    return await this.authService.updateToken(refreshToken);
  }

  @Get('sign-out')
  @UseGuards(AuthGuard)
  async signOut(
    @SessionInfo() session: GetSessionInfoDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.userService.removeRefreshTokenHash(session.id);
    return this.cookieService.removeTokens(res);
  }

  @Get('session')
  @UseGuards(AuthGuard)
  async getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
    const user = await this.userService.findUser({
      field: UserFieldEnum.ID,
      value: session.id,
      select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role'],
      relations: ['role'],
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
    };
  }
}
