import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  hash: string;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  salt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHash: string;

  @ManyToOne(() => RoleEntity, (item) => item.user)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
