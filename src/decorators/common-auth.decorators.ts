import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export function EmailField() {
  return applyDecorators(
    ApiProperty({
      example: 'user@example.com',
      description: 'Email',
    }),
    IsEmail({}, { message: 'Неверный формат email' }),
  );
}

export function PasswordField() {
  return applyDecorators(
    ApiProperty({
      example: '12345678',
      description: 'Пароль пользователя',
    }),
    IsNotEmpty({ message: 'Пароль обязателен' }),
    MinLength(8, { message: 'Пароль должен быть не менее 8 символов' }),
    MaxLength(32, { message: 'Пароль должен быть не более 32 символов' }),
  );
}

export function NewPasswordField() {
  return applyDecorators(
    ApiProperty({
      example: '12345678',
      description: 'Новый пароль пользователя',
    }),
    IsNotEmpty({ message: 'Новый пароль обязателен' }),
    MinLength(8, { message: 'Пароль должен быть не менее 8 символов' }),
    MaxLength(32, { message: 'Пароль должен быть не более 32 символов' }),
  );
}

export function ConfirmPasswordField() {
  return applyDecorators(
    ApiProperty({
      example: '12345678',
      description: 'Подтверждение нового пароля',
    }),
    IsNotEmpty({ message: 'Подтверждение пароля обязательно' }),
  );
}

export function FirstName() {
  return applyDecorators(
    ApiProperty({
      example: 'Иван',
      description: 'Имя',
    }),
    IsOptional(),
    MinLength(2, { message: 'Имя должно быть не менее 2 символов' }),
    MaxLength(32, { message: 'Имя должно быть не более 32 символов' }),
  );
}
