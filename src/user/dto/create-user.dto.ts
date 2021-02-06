import { IsBoolean, IsLowercase, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    name: 'username',
    description: 'Username of the user',
    example: 'akanass',
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @IsLowercase()
  username: string;

  @ApiProperty({
    name: 'display_name',
    description: 'Display name of the user',
    example: 'Akanass',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  display_name: string;

  @ApiProperty({
    name: 'password',
    description: 'Password of the user',
    minLength: 8,
    example: '@!=1234567890'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
