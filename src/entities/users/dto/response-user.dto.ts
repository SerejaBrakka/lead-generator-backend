import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../entities/role.entity';

export class UserResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  role: RoleEntity;
}
