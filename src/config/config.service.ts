import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get jwtAccessKey(): string {
    return this.configService.getOrThrow<string>('ACCESS_TOKEN_KEY');
  }

  get jwtRefreshKey(): string {
    return this.configService.getOrThrow<string>('REFRESH_TOKEN_KEY');
  }

  get jwtAccessSecret(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET');
  }

  get jwtAccessExpiresIn(): string {
    return this.configService.getOrThrow<string>('ACCESS_TOKEN_EXPIRES_IN');
  }

  get jwtRefreshSecret(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.getOrThrow<string>('REFRESH_TOKEN_EXPIRES_IN');
  }

  get HMAC_REFRESH_SECRET(): string {
    return this.configService.getOrThrow<string>('HMAC_REFRESH_SECRET');
  }
}
