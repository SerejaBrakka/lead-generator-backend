import { UserEntity } from '../entities/user.entity';

export class FindUserDto {
  field: string;
  value: string;
  select?: (keyof UserEntity)[];
  relations?: string[];
}
