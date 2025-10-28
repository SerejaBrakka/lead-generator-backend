import { ApiProperty } from '@nestjs/swagger';
import {
  ConfirmPasswordField,
  EmailField,
  NewPasswordField,
  PasswordField,
} from 'src/decorators/common-auth.decorators';

export class AuthUserDto {
  @EmailField()
  email: string;

  @PasswordField()
  password: string;
}

export class GetSessionInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}

export class TokenDto {
  id: string;
  email: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  refreshToken: string;
}

export class RecoveryPasswordDto extends AuthUserDto {
  @NewPasswordField()
  newPassword: string;

  @ConfirmPasswordField()
  confirmPassword: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accessTokenExpires: number;

  @ApiProperty()
  refreshTokenExpires: number;
}
