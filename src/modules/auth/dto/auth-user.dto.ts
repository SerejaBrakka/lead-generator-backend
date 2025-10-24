import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/entities/users/dto/response-user.dto';

export class AuthUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export type AuthResponseDto = UserResponseDto & TokensDto;

export class GetSessionInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;
}

export class TokenDto {
  id: string;
  email: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}

export class RecoveryPasswordDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmPassword: string;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accessTokenExpires: number;

  @ApiProperty()
  refreshTokenExpires: number;
}
