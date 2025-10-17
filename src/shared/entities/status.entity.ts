// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { StatusEnum } from '../enums/status.enum';
// import { UserEntity } from 'src/users/entities/user.entity';
// import { Region } from 'src/regions/entities/regions.entity';

// @Entity('statuses')
// export class Status {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({
//     type: 'enum',
//     enum: StatusEnum,
//     default: StatusEnum.ACTIVE,
//   })
//   name: StatusEnum;

//   @OneToMany(() => UserEntity, (user) => user.status)
//   users: UserEntity[];

//   @OneToMany(() => Region, (region) => region.status)
//   regions: Region[];
// }
