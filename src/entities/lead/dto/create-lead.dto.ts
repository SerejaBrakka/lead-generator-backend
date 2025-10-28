import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsPhoneNumber,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({
    description: 'ФИО лида',
    example: 'Иванов Иван Иванович',
    required: true,
  })
  @IsString({ message: 'ФИО должно быть строкой' })
  @IsNotEmpty({ message: 'ФИО обязательно для заполнения' })
  name: string;

  @ApiProperty({
    description: 'Номер телефона лида',
    example: '+79991234567',
    required: true,
  })
  @IsString({ message: 'Телефон должен быть строкой' })
  @IsNotEmpty({ message: 'Телефон обязателен для заполнения' })
  @IsPhoneNumber('RU', { message: 'Неверный формат номера телефона' })
  phone: string;

  @ApiProperty({
    description: 'Регион проживания',
    example: 'г. Москва',
    required: true,
  })
  @IsString({ message: 'Регион должен быть строкой' })
  @IsNotEmpty({ message: 'Регион обязателен для заполнения' })
  region: string;

  @ApiProperty({
    description: 'Сумма долга',
    example: '250000.50',
    required: true,
  })
  @IsString({ message: 'Сумма долга должна быть строкой' })
  @IsNotEmpty({ message: 'Сумма долга обязательна для заполнения' })
  amountDebt: string;

  @ApiProperty({
    description: 'Типы долга (ипотека, микрофинансовые, кредиты и т.д.)',
    example: ['ипотека', 'кредит', 'микрофинансовые'],
    required: true,
    type: [String],
  })
  @IsArray({ message: 'Типы долга должны быть массивом' })
  @ArrayNotEmpty({ message: 'Укажите хотя бы один тип долга' })
  @IsString({ each: true, message: 'Каждый тип долга должен быть строкой' })
  debtTypes: string[];

  @ApiProperty({
    description: 'Наличие имущества кроме единственного жилья',
    example: true,
    required: true,
  })
  @IsBoolean({ message: 'Поле "имущество" должно быть булевым значением' })
  things: boolean;

  @ApiProperty({
    description: 'Совершали ли вы сделки с имуществом за последние три года?',
    example: false,
    required: true,
  })
  @IsBoolean({ message: 'Поле "сделки" должно быть булевым значением' })
  deals: boolean;
}
