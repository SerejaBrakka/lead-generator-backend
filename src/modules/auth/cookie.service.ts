import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AppConfigService } from 'src/config/config.service';

interface Cookie {
  res: Response;
  key: string;
  token: string;
  expiresIn: number;
}

@Injectable()
export class CookieService {
  constructor(private configService: AppConfigService) {}

  setToken({ res, key, token, expiresIn }: Cookie) {
    res.cookie(key, token, {
      httpOnly: true,
      maxAge: expiresIn,
    });
  }

  removeTokens(res: Response) {
    const accessTokenKey = this.configService.jwtAccessKey;
    const refreshTokenKey = this.configService.jwtRefreshKey;

    res.clearCookie(accessTokenKey);
    res.clearCookie(refreshTokenKey);
  }
}
