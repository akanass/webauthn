import { IsLowercase, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    name: 'username',
    description: 'Username of the user who wants to login',
    example: 'akanass',
    minLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @IsLowercase()
  username: string;

  @ApiProperty({
    name: 'password',
    description: 'Password of the user who wants to login',
    minLength: 8,
    example: '@!=1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
