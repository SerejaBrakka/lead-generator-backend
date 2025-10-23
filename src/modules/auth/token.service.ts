import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/config.service';
import { TokenDto } from './dto/auth-user.dto';
import { HashingService } from './hashing.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: AppConfigService,
    private hashingService: HashingService,
  ) {}

  private parseExpiresIn(expiresIn: string): number {
    let milliseconds = 0;

    if (expiresIn.endsWith('s')) {
      milliseconds = parseInt(expiresIn) * 1000;
    } else if (expiresIn.endsWith('m')) {
      milliseconds = parseInt(expiresIn) * 60 * 1000;
    } else if (expiresIn.endsWith('h')) {
      milliseconds = parseInt(expiresIn) * 60 * 60 * 1000;
    } else if (expiresIn.endsWith('d')) {
      milliseconds = parseInt(expiresIn) * 24 * 60 * 60 * 1000;
    } else {
      milliseconds = 60 * 60 * 1000;
    }

    return milliseconds;
  }

  async generateTokens(userInfo: TokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    refreshTokenHash: string;
    id: string;
  }> {
    const accessTokenExpires = this.parseExpiresIn(
      this.configService.jwtAccessExpiresIn,
    );

    const refreshTokenExpires = this.parseExpiresIn(
      this.configService.jwtRefreshExpiresIn,
    );

    const accessToken = await this.jwtService.signAsync(userInfo, {
      secret: this.configService.jwtAccessSecret,
      expiresIn: accessTokenExpires,
    });

    const refreshToken = await this.jwtService.signAsync(userInfo, {
      secret: this.configService.jwtRefreshSecret,
      expiresIn: refreshTokenExpires,
    });

    const refreshTokenHash = this.hashingService.hashToken(refreshToken);

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
      refreshTokenHash,
      id: userInfo.id,
    };
  }
}
