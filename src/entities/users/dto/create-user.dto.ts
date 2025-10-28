import { FirstName } from 'src/decorators/common-auth.decorators';
import { AuthUserDto } from 'src/modules/auth/dto/auth-user.dto';

export class CreateUserDto extends AuthUserDto {
  @FirstName()
  firstName?: string;
}
