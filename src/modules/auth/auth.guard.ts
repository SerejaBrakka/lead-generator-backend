import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: AppConfigService,
  ) {}
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    const accessTokenKey = this.configService.jwtAccessKey;
    if (!accessTokenKey) return false;

    const token = req.cookies[accessTokenKey];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const sessionInfo = this.jwtService.verify(token, {
        secret: this.configService.jwtAccessSecret,
      });

      req['session'] = sessionInfo;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
