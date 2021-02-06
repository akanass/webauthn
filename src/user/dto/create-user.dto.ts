import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
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
}
