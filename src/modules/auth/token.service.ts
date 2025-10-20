import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto, TokenDto } from './dto/auth-user.dto';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: AppConfigService,
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

  async refreshToken({ refreshToken }: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
  }> {
    console.log('refreshToken', refreshToken);
    const { id, email } = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.jwtRefreshSecret,
    });
    console.log(id, email);

    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    } = await this.generateTokens({ id, email });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  async generateTokens(userInfo: TokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
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

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }
}
