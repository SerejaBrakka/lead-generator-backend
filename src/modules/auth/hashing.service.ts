import { Injectable } from '@nestjs/common';
import { pbkdf2Sync, randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class HashingService {
  private readonly PBKDF2_ITERATIONS = 10000;
  private readonly PBKDF2_KEYLEN = 64;
  private readonly PBKDF2_DIGEST = 'sha512';

  private readonly HMAC_SECRET: string;

  constructor(private configService: AppConfigService) {
    this.HMAC_SECRET = this.configService.HMAC_REFRESH_SECRET;
  }

  getSalt(): string {
    return randomBytes(16).toString('hex');
  }

  hashPassword(password: string, salt: string): string {
    return pbkdf2Sync(
      password,
      salt,
      this.PBKDF2_ITERATIONS,
      this.PBKDF2_KEYLEN,
      this.PBKDF2_DIGEST,
    ).toString('hex');
  }

  hashToken(token: string): string {
    return createHmac('sha256', this.HMAC_SECRET).update(token).digest('hex');
  }

  compareToken(token: string, storedHash: string): boolean {
    const incomingHash = this.hashToken(token);

    if (incomingHash.length !== storedHash.length) {
      return false;
    }

    return timingSafeEqual(Buffer.from(incomingHash), Buffer.from(storedHash));
  }
}
