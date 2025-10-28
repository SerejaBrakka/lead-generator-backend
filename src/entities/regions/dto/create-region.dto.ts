import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ example: 'Краснодар', description: 'Название региона' })
  @MinLength(2, { message: 'Название должно быть не менее 2 символов' })
  @MaxLength(100, { message: 'Название должно быть не более 100 символов' })
  @IsNotEmpty({ message: 'Название обязательно' })
  title: string;

  @ApiProperty({
    example: 'Краснодарский район',
    description: 'Описание региона',
  })
  @IsOptional()
  @MinLength(2, { message: 'Описание должно быть не менее 2 символов' })
  @MaxLength(500, { message: 'Описание должно быть не более 500 символов' })
  description: string;

  @ApiProperty({ example: true, description: 'Активность региона' })
  isActive: boolean;
}
