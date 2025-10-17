import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import express from 'express';
import { CreateUserDto } from 'src/entities/users/dto/create-user.dto';
import { UserResponseDto } from 'src/entities/users/dto/response-user.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { GetSessionInfoDto } from './dto/auth-user.dto';
import { SessionInfo } from './session-info.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @ApiCreatedResponse({ type: UserResponseDto })
  @Post('sign-up')
  async signUp(
    @Body() CreateUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken } = await this.authService.signUp(CreateUserDto);
    this.cookieService.setToken(res, accessToken);
  }

  @ApiCreatedResponse({ type: UserResponseDto })
  @Post('sign-in')
  async signIn(
    @Body() CreateUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken } = await this.authService.signIn(CreateUserDto);
    this.cookieService.setToken(res, accessToken);
  }

  @Get('sign-out')
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: express.Response) {
    return this.cookieService.removeToken(res);
  }

  @Get('session')
  @UseGuards(AuthGuard)
  getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
    return session;
  }
}
